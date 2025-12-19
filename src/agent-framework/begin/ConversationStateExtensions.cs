using Microsoft.Agents.Builder.State;
using System.Text.Json;

namespace InsuranceAgent;

public class StoredChatMessage
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public static class ConversationStateExtensions
{
    public static List<StoredChatMessage> GetConversationHistory(this ConversationState state)
    {
        var historyJson = state.GetValue<string>("conversationHistory");
        if (string.IsNullOrEmpty(historyJson))
        {
            return [];
        }
        
        try
        {
            return JsonSerializer.Deserialize<List<StoredChatMessage>>(historyJson) ?? [];
        }
        catch
        {
            return [];
        }
    }

    public static void SetConversationHistory(this ConversationState state, List<StoredChatMessage> messages)
    {
        var historyJson = JsonSerializer.Serialize(messages);
        state.SetValue("conversationHistory", historyJson);
    }

    public static void AddMessageToHistory(this ConversationState state, string role, string content)
    {
        var history = state.GetConversationHistory();
        history.Add(new StoredChatMessage { Role = role, Content = content });
        
        state.SetConversationHistory(history);
    }

    public static void ClearConversationHistory(this ConversationState state)
    {
        state.SetValue("conversationHistory", string.Empty);
    }

    public static UserProfile? GetCachedUserProfile(this ConversationState state)
    {
        var profileJson = state.GetValue<string>("cachedUserProfile");
        if (string.IsNullOrEmpty(profileJson))
        {
            return null;
        }
        
        try
        {
            return JsonSerializer.Deserialize<UserProfile>(profileJson);
        }
        catch
        {
            return null;
        }
    }

    public static void SetCachedUserProfile(this ConversationState state, UserProfile userProfile)
    {
        var profileJson = JsonSerializer.Serialize(userProfile);
        state.SetValue("cachedUserProfile", profileJson);
    }

    public static String GetCachedOBOAccessToken(this ConversationState state)
    {
        var accessToken = state.GetValue<string>("cachedOBOAccessToken");
        if (string.IsNullOrEmpty(accessToken))
        {
            return null;
        }
        else
    {
            return accessToken;
        }
    }

    public static void SetCachedOBOAccessToken(this ConversationState state, string accessToken)
    {
        state.SetValue("cachedOBOAccessToken", accessToken);
    }

    public static bool HasSystemMessage(this ConversationState state)
    {
        var history = state.GetConversationHistory();
        return history.Any(m => m.Role.Equals("system", StringComparison.OrdinalIgnoreCase));
    }

    public static string? GetCachedSystemMessage(this ConversationState state)
    {
        var history = state.GetConversationHistory();
        var systemMessage = history.FirstOrDefault(m => m.Role.Equals("system", StringComparison.OrdinalIgnoreCase));
        return systemMessage?.Content;
    }

    public static void ClearCachedUserProfile(this ConversationState state)
    {
        state.SetValue("cachedUserProfile", string.Empty);
    }
}