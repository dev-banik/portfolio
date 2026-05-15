namespace Portfolio.Application.Interfaces;

public interface IEmailService
{
    Task SendContactReplyAsync(string toEmail, string toName, string subject, string message);
    Task SendContactNotificationAsync(string fromName, string fromEmail, string subject, string message);
}
