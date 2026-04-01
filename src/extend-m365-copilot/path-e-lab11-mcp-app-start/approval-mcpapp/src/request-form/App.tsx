// src/request-form/App.tsx — Access Request Form Widget
import { App } from "@modelcontextprotocol/ext-apps";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Text,
  Button,
  Input,
  Textarea,
  Dropdown,
  Option,
  Badge,
  Spinner,
  Field,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  KeyMultiple20Regular,
  Send20Regular,
  CheckmarkCircle20Filled,
  FullScreenMaximize24Regular,
  FullScreenMinimize24Regular,
} from "@fluentui/react-icons";
import { createRoot } from "react-dom/client";
import { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────
interface FormData {
  employeeName: string;
  employeeEmail: string;
  systems: string[];
  roles: Record<string, string[]>;
}

interface SubmitResult {
  success: boolean;
  request?: {
    id: string;
    system: string;
    role: string;
    status: string;
  };
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    maxWidth: "480px",
  },
  actions: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
  },
  success: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalXXL,
    textAlign: "center",
  },
  successIcon: {
    color: tokens.colorPaletteGreenForeground1,
    fontSize: "48px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
});

// ─── Component ───────────────────────────────────────────────────────
function RequestFormWidget() {
  const styles = useStyles();
  const [appInstance] = useState(() => new App({ name: "Request Access Form", version: "1.0.0" }));
  const [formConfig, setFormConfig] = useState<FormData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [justification, setJustification] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track browser fullscreen changes (fallback path)
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    // 1. Try MCP Apps SDK
    try {
      if (appInstance) {
        await appInstance.requestDisplayMode({ mode: isFullscreen ? "inline" : "fullscreen" });
        setIsFullscreen(!isFullscreen);
        return;
      }
    } catch { /* not available */ }
    // 2. Try browser Fullscreen API
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return;
      } else {
        await document.exitFullscreen();
        return;
      }
    } catch { /* blocked by sandbox or not supported */ }
    // 3. CSS-based fallback (always works)
    setIsFullscreen((prev) => !prev);
  }, [appInstance, isFullscreen]);

  useEffect(() => {
    appInstance.ontoolresult = (result) => {
      if (result.structuredContent) {
        const data = result.structuredContent as unknown as FormData;
        setFormConfig(data);
        if (data.employeeName) setName(data.employeeName);
        if (data.employeeEmail) setEmail(data.employeeEmail);
      }
    };
    appInstance.connect();
  }, [appInstance]);

  const availableRoles = formConfig?.roles[selectedSystem] ?? [];

  const handleSubmit = useCallback(async () => {
    if (!name || !email || !selectedSystem || !selectedRole || !justification) return;
    setSubmitting(true);
    setError(null);
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out. Please try again.")), 30_000),
      );
      const result = await Promise.race([
        appInstance.callServerTool({
          name: "submit-request",
          arguments: {
            employeeName: name,
            employeeEmail: email,
            system: selectedSystem,
            role: selectedRole,
            justification,
          },
        }),
        timeout,
      ]);
      if (result.structuredContent) {
        setSubmitted(result.structuredContent as unknown as SubmitResult);
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [appInstance, name, email, selectedSystem, selectedRole, justification]);

  if (!formConfig) {
    return (
      <div className={styles.loading}>
        <Spinner label="Loading form..." />
      </div>
    );
  }

  if (submitted?.success) {
    return (
      <div className={styles.success}>
        <CheckmarkCircle20Filled style={{ fontSize: "48px", color: tokens.colorPaletteGreenForeground1 }} />
        <Text size={500} weight="bold">Request Submitted!</Text>
        <Text size={300}>
          Your request <Badge appearance="filled" color="brand">{submitted.request?.id}</Badge> for{" "}
          <Text weight="semibold">{submitted.request?.role}</Text> access to{" "}
          <Text weight="semibold">{submitted.request?.system}</Text> has been submitted for review.
        </Text>
        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
          Current status: {submitted.request?.status}
        </Text>
      </div>
    );
  }

  const isValid = name && email && selectedSystem && selectedRole && justification;

  return (
    <div className={styles.root} style={isFullscreen ? {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999, overflowY: "auto",
    } : undefined}>
      <div className={styles.header}>
        <KeyMultiple20Regular />
        <Text size={500} weight="bold">Request System Access</Text>
        <Button
          appearance="subtle"
          icon={isFullscreen ? <FullScreenMinimize24Regular /> : <FullScreenMaximize24Regular />}
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          style={{ marginLeft: "auto" }}
        />
      </div>

      <div className={styles.form}>
        <Field label="Full Name" required>
          <Input
            value={name}
            onChange={(_e, data) => setName(data.value)}
            placeholder="e.g. Jane Doe"
          />
        </Field>

        <Field label="Email" required>
          <Input
            type="email"
            value={email}
            onChange={(_e, data) => setEmail(data.value)}
            placeholder="e.g. jane@contoso.com"
          />
        </Field>

        <Field label="Target System" required>
          <Dropdown
            placeholder="Select a system"
            value={selectedSystem}
            onOptionSelect={(_e, data) => {
              setSelectedSystem(data.optionValue ?? "");
              setSelectedRole("");
            }}
          >
            {formConfig.systems.map((sys) => (
              <Option key={sys} value={sys}>{sys}</Option>
            ))}
          </Dropdown>
        </Field>

        <Field label="Requested Role" required>
          <Dropdown
            placeholder={selectedSystem ? "Select a role" : "Select a system first"}
            value={selectedRole}
            disabled={!selectedSystem}
            onOptionSelect={(_e, data) => setSelectedRole(data.optionValue ?? "")}
          >
            {availableRoles.map((role) => (
              <Option key={role} value={role}>{role}</Option>
            ))}
          </Dropdown>
        </Field>

        <Field label="Business Justification" required>
          <Textarea
            value={justification}
            onChange={(_e, data) => setJustification(data.value)}
            placeholder="Explain why you need this access..."
            rows={3}
          />
        </Field>

        {error && (
          <Text size={200} style={{ color: tokens.colorPaletteRedForeground1 }}>
            {error}
          </Text>
        )}

        <div className={styles.actions}>
          <Button
            appearance="primary"
            icon={<Send20Regular />}
            onClick={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </div>
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
      <RequestFormWidget />
    </FluentProvider>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
