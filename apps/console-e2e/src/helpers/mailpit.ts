interface MailpitMessage {
  ID: string;
  MessageID: string;
  From: { Name: string; Address: string };
  To: { Name: string; Address: string }[];
  Subject: string;
  Created: string;
  Size: number;
  Snippet: string;
}

interface MailpitMessageDetail extends MailpitMessage {
  HTML: string;
  Text: string;
}

interface MailpitMessageList {
  total: number;
  count: number;
  messages: MailpitMessage[];
}

export class MailpitClient {
  constructor(private readonly apiUrl: string) {}

  public async getMessages(): Promise<MailpitMessage[]> {
    const response = await fetch(`${this.apiUrl}/api/v1/messages`);
    const data = (await response.json()) as MailpitMessageList;

    return data.messages;
  }

  public async getMessage(id: string): Promise<MailpitMessageDetail> {
    const response = await fetch(`${this.apiUrl}/api/v1/message/${id}`);

    return (await response.json()) as MailpitMessageDetail;
  }

  public async searchMessages(query: string): Promise<MailpitMessage[]> {
    const response = await fetch(`${this.apiUrl}/api/v1/search?query=${encodeURIComponent(query)}`);
    const data = (await response.json()) as MailpitMessageList;

    return data.messages;
  }

  public async waitForEmail(
    toEmail: string,
    options: { timeout?: number; subject?: string } = {}
  ): Promise<MailpitMessageDetail> {
    const { timeout = 30000, subject } = options;
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const messages = await this.searchMessages(`to:${toEmail}`);

      for (const message of messages) {
        if (!subject || message.Subject.includes(subject)) {
          return this.getMessage(message.ID);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    throw new Error(`Timed out waiting for email to ${toEmail}`);
  }

  public async getInvitationToken(toEmail: string): Promise<string> {
    const email = await this.waitForEmail(toEmail);
    const match = email.Text.match(/accept-invitation#token=(.+)/);

    if (!match) {
      const htmlMatch = email.HTML.match(/accept-invitation#token=([^"&\s]+)/);

      if (!htmlMatch) {
        throw new Error(`Could not find invitation token in email to ${toEmail}`);
      }

      return htmlMatch[1];
    }

    return match[1];
  }

  public async deleteAllMessages(): Promise<void> {
    await fetch(`${this.apiUrl}/api/v1/messages`, { method: 'DELETE' });
  }
}
