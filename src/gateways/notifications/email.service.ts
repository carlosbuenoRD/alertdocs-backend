import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(subject): void {
    this.mailerService.sendMail({
      to: 'lapanik153@duscore.com',
      from: 'lapanik153@duscore.com',
      subject,
      text: 'Hellow world',
      html: `<bold>Increible esta funcionando</bold>`,
    });
  }
}
