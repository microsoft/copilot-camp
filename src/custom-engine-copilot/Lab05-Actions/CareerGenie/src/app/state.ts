import { TurnState, DefaultConversationState } from "@microsoft/teams-ai";

// Strongly type the applications turn state
interface ConversationState extends DefaultConversationState {
  lists: Record<string, string[]>;
}
export type ApplicationTurnState = TurnState<ConversationState>;