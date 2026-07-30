// ANSI color codes for terminal styling
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m'
};

interface McpToolCallMetrics {
  toolName: string;
  args?: any;
  startTime: number;
  endTime?: number;
  success?: boolean;
  itemCount?: number;
  responseSize?: number;
  error?: string;
}

let callCounter = 0;

type BoxStyle = 'regular' | 'bold';

// Utility function to create padded box borders
const createBox = (width: number, style: BoxStyle = 'regular') => {
  const styles = {
    regular: {
      horizontal: '─',
      topLeft: '┌',
      topRight: '┐',
      bottomLeft: '└',
      bottomRight: '┘',
      vertical: '│'
    },
    bold: {
      horizontal: '═',
      topLeft: '╔',
      topRight: '╗',
      bottomLeft: '╚',
      bottomRight: '╝',
      vertical: '║'
    }
  };

  const chars = styles[style];
  const border = chars.horizontal.repeat(width);
  const padLine = (text: string) => {
    const strippedLength = text.replace(/\x1b\[[0-9;]*m/g, '').length;
    const padding = ' '.repeat(Math.max(0, width - strippedLength - 1));
    return text + padding;
  };

  return {
    top: `${chars.topLeft}${border}${chars.topRight}`,
    bottom: `${chars.bottomLeft}${border}${chars.bottomRight}`,
    middle: () => `${chars.vertical}${chars.horizontal.repeat(width)}${chars.vertical}`,
    line: (text: string) => `${chars.vertical} ${padLine(text)}${chars.vertical}`,
    padLine
  };
};

export const logger = {
  info: (message: string, meta?: unknown): void => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (message: string, meta?: unknown): void => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (message: string, meta?: unknown): void => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta) : '');
  },
  debug: (message: string, meta?: unknown): void => {
    const nodeEnv = process.env['NODE_ENV'];
    if (nodeEnv === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta ? JSON.stringify(meta) : '');
    }
  },

  // Enhanced MCP logging functions
  mcpToolStart: (toolName: string, args?: any): McpToolCallMetrics => {
    callCounter++;
    const metrics: McpToolCallMetrics = {
      toolName,
      args,
      startTime: Date.now()
    };

    const box = createBox(40, 'regular');
    const callNumber = `MCP TOOL CALL #${callCounter.toString().padStart(3, '0')}`;

    console.log(`\n${colors.cyan}${colors.bright}${box.top}${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}${box.line(callNumber)}${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}${box.bottom}${colors.reset}`);
    console.log(`${colors.blue}Tool Name:${colors.reset} ${colors.yellow}${colors.bright}${toolName}${colors.reset}`);
    console.log(`${colors.blue}Started:${colors.reset}   ${new Date().toISOString()}`);
    
    if (args && Object.keys(args).length > 0) {
      console.log(`${colors.blue}Args:${colors.reset}`);
      Object.entries(args).forEach(([key, value]) => {
        const displayValue = typeof value === 'string' ? 
          (value.length > 50 ? `${value.substring(0, 50)}...` : value) :
          JSON.stringify(value);
        console.log(`${colors.dim}   ${key}:${colors.reset} ${colors.white}${displayValue}${colors.reset}`);
      });
    }
    
    console.log(`${colors.magenta}Status:${colors.reset} ${colors.yellow}Processing...${colors.reset}`);
    
    return metrics;
  },

  mcpToolSuccess: (metrics: McpToolCallMetrics, result: any): void => {
    metrics.endTime = Date.now();
    metrics.success = true;
    
    // Calculate response metrics
    let itemCount = 0;
    let responseSize = 0;
    
    if (result?.data) {
      if (Array.isArray(result.data)) {
        itemCount = result.data.length;
      } else if (result.data) {
        itemCount = 1;
      }
      responseSize = JSON.stringify(result.data).length;
      metrics.itemCount = itemCount;
      metrics.responseSize = responseSize;
    }

    const duration = metrics.endTime - metrics.startTime;
    const sizeFormatted = responseSize > 1024 ? 
      `${(responseSize / 1024).toFixed(1)}KB` : 
      `${responseSize}B`;

    console.log(`\n${colors.green}${colors.bright}TOOL EXECUTION COMPLETE${colors.reset}`);
    console.log(`${colors.green}Results:${colors.reset}    ${colors.bright}${itemCount} items${colors.reset} ${colors.dim}(${sizeFormatted})${colors.reset}`);
    console.log(`${colors.green}Duration:${colors.reset}   ${colors.bright}${duration}ms${colors.reset}`);
    console.log(`${colors.green}Status:${colors.reset}     ${colors.bgGreen}${colors.bright} SUCCESS ${colors.reset}`);
    
    if (result?.message) {
      console.log(`${colors.green}Message:${colors.reset}    ${colors.dim}${result.message}${colors.reset}`);
    }
    
    console.log(`${colors.green}${colors.bright}Tool "${metrics.toolName}" executed!${colors.reset}\n`);
  },

  mcpToolError: (metrics: McpToolCallMetrics, error: Error | string): void => {
    metrics.endTime = Date.now();
    metrics.success = false;
    metrics.error = typeof error === 'string' ? error : error.message;
    
    const duration = metrics.endTime - metrics.startTime;
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    console.log(`\n${colors.red}${colors.bright}TOOL EXECUTION FAILED${colors.reset}`);
    console.log(`${colors.red}Error:${colors.reset}      ${colors.bright}${errorMessage}${colors.reset}`);
    console.log(`${colors.red}Duration:${colors.reset}   ${colors.bright}${duration}ms${colors.reset}`);
    console.log(`${colors.red}Status:${colors.reset}     ${colors.bgRed}${colors.bright} FAILED ${colors.reset}`);
    
    if (error instanceof Error && error.stack) {
      console.log(`${colors.red}${colors.dim}Stack trace:${colors.reset}`);
      console.log(`${colors.dim}${error.stack}${colors.reset}`);
    }
    
    console.log(`${colors.red}${colors.bright}Tool "${metrics.toolName}" encountered an error!${colors.reset}\n`);
  },

  mcpServerStart: (port: number, host: string = 'localhost'): void => {
    const box = createBox(40, 'bold');
    const url = `http://${host}:${port}`;
    
    console.log(`\n`);
    console.log(`${colors.magenta}${colors.bright}${box.top}${colors.reset}`);
    console.log(`${colors.magenta}${colors.bright}${box.line('ZAVA MCP SERVER IGNITION SEQUENCE')}${colors.reset}`);
    console.log(`${colors.magenta}${colors.bright}${box.middle()}${colors.reset}`);
    console.log(`${colors.magenta}${colors.bright}${box.line(`Status: ${colors.green}ONLINE & READY${colors.magenta}`)}${colors.reset}`);
    console.log(`${colors.magenta}${colors.bright}${box.line(`Port: ${colors.yellow}${port}${colors.magenta}`)}${colors.reset}`);
    console.log(`${colors.magenta}${colors.bright}${box.line(`Watching: ${url}${colors.magenta}`)}${colors.reset}`);
    console.log(`${colors.magenta}${colors.bright}${box.bottom}${colors.reset}`);
  },

  mcpStats: (): void => {
    console.log(`\n${colors.blue}${colors.bright}MCP SESSION STATS${colors.reset}`);
    console.log(`${colors.blue}Total calls processed: ${colors.bright}${callCounter}${colors.reset}`);
    console.log(`${colors.blue}Session uptime: ${colors.bright}${Math.floor(process.uptime())}s${colors.reset}\n`);
  },

  // Detailed incoming request logger
  mcpRequest: (details: {
    method: string;
    url: string;
    ip?: string;
    userAgent?: string;
    origin?: string;
    authenticated: boolean;
    user?: {
      sub?: string;
      preferred_username?: string;
      name?: string;
      scp?: string[];
      iss?: string;
      aud?: string | string[];
      tid?: string;
    };
    contentType?: string;
    contentLength?: string;
    mcpMethod?: string;
    mcpToolName?: string;
    mcpPromptName?: string;
    requestId?: string;
  }): void => {
    const box = createBox(55, 'regular');
    const timestamp = new Date().toISOString();

    console.log(`\n${colors.cyan}${box.top}${colors.reset}`);
    console.log(`${colors.cyan}${box.line(`${colors.bright}INCOMING REQUEST${colors.reset}${colors.cyan}`)}${colors.reset}`);
    console.log(`${colors.cyan}${box.bottom}${colors.reset}`);

    // HTTP details
    console.log(`${colors.blue}Timestamp:${colors.reset}      ${timestamp}`);
    console.log(`${colors.blue}HTTP:${colors.reset}           ${colors.bright}${details.method} ${details.url}${colors.reset}`);
    console.log(`${colors.blue}Client IP:${colors.reset}      ${details.ip || 'unknown'}`);
    console.log(`${colors.blue}User-Agent:${colors.reset}     ${colors.dim}${(details.userAgent || 'unknown').substring(0, 80)}${colors.reset}`);
    if (details.origin) {
      console.log(`${colors.blue}Origin:${colors.reset}         ${details.origin}`);
    }
    if (details.contentType) {
      console.log(`${colors.blue}Content-Type:${colors.reset}   ${details.contentType}`);
    }
    if (details.contentLength) {
      console.log(`${colors.blue}Content-Len:${colors.reset}    ${details.contentLength} bytes`);
    }
    if (details.requestId) {
      console.log(`${colors.blue}Request-ID:${colors.reset}     ${details.requestId}`);
    }

    // MCP protocol details
    if (details.mcpMethod) {
      console.log(`${colors.magenta}MCP Method:${colors.reset}     ${colors.yellow}${colors.bright}${details.mcpMethod}${colors.reset}`);
    }
    if (details.mcpToolName) {
      console.log(`${colors.magenta}MCP Tool:${colors.reset}       ${colors.yellow}${colors.bright}${details.mcpToolName}${colors.reset}`);
    }
    if (details.mcpPromptName) {
      console.log(`${colors.magenta}MCP Prompt:${colors.reset}     ${colors.yellow}${colors.bright}${details.mcpPromptName}${colors.reset}`);
    }

    // Auth details
    if (details.authenticated && details.user) {
      console.log(`${colors.green}Auth:${colors.reset}           ${colors.bgGreen}${colors.bright} AUTHENTICATED ${colors.reset}`);
      console.log(`${colors.green}User:${colors.reset}           ${colors.bright}${details.user.preferred_username || details.user.sub || 'unknown'}${colors.reset}`);
      if (details.user.name) {
        console.log(`${colors.green}Display Name:${colors.reset}   ${details.user.name}`);
      }
      console.log(`${colors.green}Subject (sub):${colors.reset}  ${details.user.sub || 'n/a'}`);
      if (details.user.iss) {
        console.log(`${colors.green}Issuer:${colors.reset}         ${colors.dim}${details.user.iss}${colors.reset}`);
      }
      if (details.user.aud) {
        const aud = Array.isArray(details.user.aud) ? details.user.aud.join(', ') : details.user.aud;
        console.log(`${colors.green}Audience:${colors.reset}       ${colors.dim}${aud}${colors.reset}`);
      }
      if (details.user.tid) {
        console.log(`${colors.green}Tenant ID:${colors.reset}      ${colors.dim}${details.user.tid}${colors.reset}`);
      }
      if (details.user.scp && details.user.scp.length > 0) {
        console.log(`${colors.green}Scopes:${colors.reset}         ${details.user.scp.join(', ')}`);
      }
    } else {
      console.log(`${colors.yellow}Auth:${colors.reset}           ${colors.bgYellow}${colors.bright} UNAUTHENTICATED ${colors.reset}`);
    }

    console.log('');
  },

  // Response logger
  mcpResponse: (details: {
    method: string;
    url: string;
    statusCode: number;
    durationMs: number;
    user?: string;
  }): void => {
    const statusColor = details.statusCode < 400 ? colors.green : details.statusCode < 500 ? colors.yellow : colors.red;
    console.log(
      `${statusColor}← ${details.method} ${details.url} ${colors.bright}${details.statusCode}${colors.reset} ` +
      `${colors.dim}${details.durationMs}ms${colors.reset}` +
      `${details.user ? ` ${colors.dim}[${details.user}]${colors.reset}` : ''}`
    );
  }
};