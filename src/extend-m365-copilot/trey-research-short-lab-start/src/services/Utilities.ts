// Throw this object to return an HTTP error
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Clean up common issues with Copilot parameters
export function cleanUpParameter(name: string, value: string): string {

  let val = value.toLowerCase();
  if (val.toLowerCase().includes("trey") || val.toLowerCase().includes("research")) {
    const newVal = val.replace("trey", "").replace("research", "").trim();
    console.log(`   ❗ Plugin name detected in the ${name} parameter '${val}'; replacing with '${newVal}'.`);
    val = newVal;
  }
  if (val === "<user_name>") {
    console.log(`   ❗ Invalid name '${val}'; replacing with 'avery'.`);
    val = "avery";
  }
  if (name==="role" && val === "consultant") {
    console.log(`   ❗ Invalid role name '${val}'; replacing with ''.`);
    val = "";
  }
  if (val === "null") {
    console.log(`   ❗ Invalid value '${val}'; replacing with ''.`);
    val = "";
  }
  return val;

}
