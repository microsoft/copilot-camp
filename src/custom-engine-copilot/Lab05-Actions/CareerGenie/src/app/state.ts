// See https://aka.ms/teams-ai-library to learn more about the Teams AI library.
import { TurnState, DefaultConversationState } from "@microsoft/teams-ai";

// Strongly type the applications turn state
interface ConversationState extends DefaultConversationState {
  lists: Record<string, string[]>;
}
export type ApplicationTurnState = TurnState<ConversationState>;