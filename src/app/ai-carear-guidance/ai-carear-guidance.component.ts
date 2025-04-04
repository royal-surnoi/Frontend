import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: Date;
  isError?: boolean;
}

@Component({
  selector: 'app-ai-carear-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-carear-guidance.component.html',
  styleUrl: './ai-carear-guidance.component.css'
})
export class AiCarearGuidanceComponent {
  @ViewChild('chatMessages') private messagesContainer!: ElementRef;
  userId:any;

  ngOnInit() {
    this.userId = localStorage.getItem('id');
  }
  
  messages: ChatMessage[] = [];
  userQuestion = '';
  isTyping = false;
  isDarkMode = false;
  private lastQuestion = '';
  private apiBaseUrlAI = environment.apiBaseUrlAI;

  private apiUrl = `${this.apiBaseUrlAI}/career_guidance_chat/guidance`;
  private clearCacheUrl = `${this.apiBaseUrlAI}/clear_cache/clear_cache`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2
  ) {
    // Listen for page navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.clearCache();
    });

    // Listen for window close
    window.addEventListener('beforeunload', () => {
      this.clearCache();
    });
  }

  ngOnDestroy() {
    this.clearCache();
  }


  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  private clearCache(): void {
    this.http.post(this.clearCacheUrl, {user_id:this.userId}).subscribe({
      error: (error) => console.error('Error clearing cache:', error)
    });
  }


  askSuggestion(topic: string): void {
    const questions = {
      'career path': 'What career path should I follow as a software engineer?',
      'skills': 'What are the most important skills I should develop?',
      'education': 'What educational qualification required according to my Role?',
      'job opportunities': 'What are the current job opportunities According to My Eduaction?'
    };
    
    this.userQuestion = questions[topic as keyof typeof questions];
    this.askQuestion();
  }

  fillQuestion(question: string): void {
    this.userQuestion = question;
  }

  clearChat(): void {
    this.messages = [];
    this.clearCache();
  }

  retryLastQuestion(): void {
    if (this.lastQuestion) {
      this.userQuestion = this.lastQuestion;
      this.askQuestion();
    }
  }

  askQuestion(): void {
    if (!this.userQuestion.trim()) return;

    const userMessage = this.userQuestion;
    this.lastQuestion = userMessage; // Store the question for retry

    this.messages.push({
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    });

    const body = {
      user_id: this.userId,
      followup_question: userMessage
    };

    this.userQuestion = '';
    this.isTyping = true;

    this.http.post(this.apiUrl, body).subscribe({
      next: (response: any) => {
        this.isTyping = false;
        this.messages.push({
          text: response.followup_response,
          isUser: false,
          timestamp: new Date()
        });
        this.scrollToBottom();
      },
      error: (error) => {
        this.isTyping = false;
        console.error('Error:', error);
        this.messages.push({
          text: 'Sorry, there was an error processing your question. Please try again.',
          isUser: false,
          timestamp: new Date(),
          isError: true
        });
      }
    });
  }
}
