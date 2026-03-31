// src/approval-panel/App.tsx — Approval Panel Widget
import { App } from "@modelcontextprotocol/ext-apps";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Card,
  CardHeader,
  Text,
  Button,
  Badge,
  Textarea,
  Spinner,
  Divider,
  Field,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  CheckmarkCircle20Filled,
  DismissCircle20Filled,
  PersonAccounts20Regular,
  ShieldKeyhole20Regular,
  Info20Regular,
  FullScreenMaximize24Regular,
  FullScreenMinimize24Regular,
} from "@fluentui/react-icons";
import { createRoot } from "react-dom/client";
import { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────
interface AccessRequest {
  id: string;
  employeeName: string;
  employeeEmail: string;
  system: string;
  role: string;
  justification: string;
  status: string;
  createdAt: string;
}

interface ApprovalData {
  requests: AccessRequest[];
  error?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────
const useStyles = makeStyles({
  root: {
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: "100%",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalL,
  },
  card: {
    marginBottom: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalM,
  },
  requestDetails: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalM}`,
    marginBottom: tokens.spacingVerticalM,
  },
  label: {
    color: tokens.colorNeutralForeground3,
  },
  justification: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: tokens.spacingVerticalM,
  },
  actions: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
  },
  decisionMade: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    marginTop: tokens.spacingVerticalS,
  },
  approved: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground1,
  },
  rejected: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
});

// ─── Single Request Card ─────────────────────────────────────────────
function RequestCard({
  request,
  appInstance,
  onDecisionMade,
}: {
  request: AccessRequest;
  appInstance: App;
  onDecisionMade: (requestId: string) => void;
}) {
  const styles = useStyles();
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusColor = (status: string) => {
    switch (status) {
      case "Manager Review": return "warning" as const;
      case "IT Review": return "informative" as const;
      case "Granted": return "success" as const;
      case "Rejected": return "danger" as const;
      default: return "brand" as const;
    }
  };

  const handleDecision = useCallback(
    async (action: "approve" | "reject") => {
      setProcessing(true);
      setError(null);
      try {
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out. Please try again.")), 30_000),
        );
        await Promise.race([
          appInstance.callServerTool({
            name: "submit-decision",
            arguments: {
              requestId: request.id,
              decision: action,
              reviewer: "Current User",
              comment: comment || (action === "approve" ? "Approved" : "Rejected"),
            },
          }),
          timeout,
        ]);
        setDecision(action === "approve" ? "approved" : "rejected");
        // Remove from the parent list after a brief delay so the user sees the decision
        setTimeout(() => onDecisionMade(request.id), 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit decision. Please try again.");
      } finally {
        setProcessing(false);
      }
    },
    [appInstance, request.id, comment, onDecisionMade],
  );

  const isPending = request.status === "Manager Review" || request.status === "IT Review";

  return (
    <Card className={styles.card}>
      <CardHeader
        header={
          <Text weight="bold" size={400}>
            {request.id}
          </Text>
        }
        description={
          <Badge appearance="filled" color={statusColor(request.status)}>
            {request.status}
          </Badge>
        }
      />

      <Divider style={{ margin: `${tokens.spacingVerticalS} 0` }} />

      <div className={styles.requestDetails}>
        <Text className={styles.label} size={200}><PersonAccounts20Regular style={{ verticalAlign: "middle", marginRight: "4px" }} />Employee</Text>
        <Text size={200}>{request.employeeName} ({request.employeeEmail})</Text>

        <Text className={styles.label} size={200}><ShieldKeyhole20Regular style={{ verticalAlign: "middle", marginRight: "4px" }} />System</Text>
        <Text size={200}>{request.system}</Text>

        <Text className={styles.label} size={200}>Role</Text>
        <Text size={200}>{request.role}</Text>

        <Text className={styles.label} size={200}>Submitted</Text>
        <Text size={200}>{new Date(request.createdAt).toLocaleDateString()}</Text>
      </div>

      <div className={styles.justification}>
        <Text size={200} weight="semibold" style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
          <Info20Regular /> Justification
        </Text>
        <Text size={200}>{request.justification}</Text>
      </div>

      {decision ? (
        <div
          className={`${styles.decisionMade} ${decision === "approved" ? styles.approved : styles.rejected}`}
        >
          {decision === "approved" ? (
            <CheckmarkCircle20Filled />
          ) : (
            <DismissCircle20Filled />
          )}
          <Text weight="semibold">
            {decision === "approved" ? "Approved" : "Rejected"}
          </Text>
        </div>
      ) : isPending ? (
        <>
          <Field label="Comment">
            <Textarea
              value={comment}
              onChange={(_e, data) => setComment(data.value)}
              placeholder="Add a comment (optional)..."
              rows={2}
            />
          </Field>
          <div className={styles.actions}>
            <Button
              appearance="primary"
              icon={<CheckmarkCircle20Filled />}
              onClick={() => handleDecision("approve")}
              disabled={processing}
              style={{ backgroundColor: tokens.colorPaletteGreenBackground3 }}
            >
              Approve
            </Button>
            <Button
              appearance="secondary"
              icon={<DismissCircle20Filled />}
              onClick={() => handleDecision("reject")}
              disabled={processing}
              style={{ color: tokens.colorPaletteRedForeground1 }}
            >
              Reject
            </Button>
          </div>
          {error && (
            <Text size={200} style={{ color: tokens.colorPaletteRedForeground1, marginTop: tokens.spacingVerticalS }}>
              {error}
            </Text>
          )}
        </>
      ) : null}
    </Card>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────
function ApprovalPanelWidget() {
  const styles = useStyles();
  const [appInstance] = useState(() => new App({ name: "Approval Panel", version: "1.0.0" }));
  const [data, setData] = useState<ApprovalData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDecisionMade = useCallback((requestId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = prev.requests.filter((r) => r.id !== requestId);
      return { ...prev, requests: updated };
    });
  }, []);

  // Track browser fullscreen changes (fallback path)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (appInstance) {
        await appInstance.requestDisplayMode({ mode: isFullscreen ? "inline" : "fullscreen" });
        setIsFullscreen(!isFullscreen);
        return;
      }
    } catch { /* not available */ }
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return;
      } else {
        await document.exitFullscreen();
        return;
      }
    } catch { /* blocked by sandbox or not supported */ }
    setIsFullscreen((prev) => !prev);
  }, [appInstance, isFullscreen]);

  useEffect(() => {
    appInstance.ontoolresult = (result) => {
      if (result.structuredContent) {
        setData(result.structuredContent as unknown as ApprovalData);
      }
    };
    appInstance.connect();
  }, [appInstance]);

  if (!data) {
    return (
      <div className={styles.loading}>
        <Spinner label="Loading approvals..." />
      </div>
    );
  }

  if (data.error === "not_found") {
    return (
      <div className={styles.empty}>
        <Text size={400}>Request not found</Text>
      </div>
    );
  }

  if (!data.requests || data.requests.length === 0) {
    return (
      <div className={styles.empty}>
        <CheckmarkCircle20Filled style={{ fontSize: "32px" }} />
        <Text size={400} weight="semibold">No pending approvals</Text>
        <Text size={200}>All access requests have been reviewed.</Text>
      </div>
    );
  }

  return (
    <div className={styles.root} style={isFullscreen ? {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999, overflowY: "auto",
    } : undefined}>
      <div className={styles.header}>
        <ShieldKeyhole20Regular />
        <Text size={500} weight="bold">Access Request Approvals</Text>
        <Badge appearance="filled" color="warning">{data.requests.length} pending</Badge>
        <Button
          appearance="subtle"
          icon={isFullscreen ? <FullScreenMinimize24Regular /> : <FullScreenMaximize24Regular />}
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          style={{ marginLeft: "auto" }}
        />
      </div>

      {data.requests.map((req) => (
        <RequestCard key={req.id} request={req} appInstance={appInstance} onDecisionMade={handleDecisionMade} />
      ))}
    </div>
  );
}

// ─── Theme Detection & Render ────────────────────────────────────────
function Root() {
  const [isDark, setIsDark] = useState(
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <ApprovalPanelWidget />
    </FluentProvider>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
