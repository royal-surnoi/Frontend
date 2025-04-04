import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';


interface ChatRequest {
  user_id: number;
  input: string;
}

interface ChatResponse {
  corrections: string;
  ai_reply: string;
}

interface ChatHistory {
  userInput: string;
  corrections: string;
  aiReply: string;
  timestamp: string;
}

@Component({
  selector: 'app-languagelearning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './languagelearning.component.html',
  styleUrl: './languagelearning.component.css'
})
export class LanguagelearningComponent {
  userInput: string = '';
  corrections: string = '';
  aiReply: string = '';
  isLoading1: boolean = false;
  chatHistory: ChatHistory[] = [];
  private apiBaseUrlAI = environment.apiBaseUrlAI;

  constructor(private http: HttpClient) { }


  saveChatHistory() {
    const newChat: ChatHistory = {
      userInput: this.userInput,
      corrections: this.corrections,
      aiReply: this.aiReply,
      timestamp: new Date().toISOString(),
    };
    this.chatHistory.push(newChat); // Add to history
  }
  

  resetChat() {

    const data = {
      user_id: 42
    };

    this.http.post<any>(`${this.apiBaseUrlAI}/delete-lanGPTsession/clear`, data).subscribe({
      next: (response: any) => {
        this.corrections = '';
        this.aiReply = '';
        this.userInput = '';
        this.chatHistory = [];
        localStorage.removeItem('LanguageLearning');
        alert("Chart Cleared Successfully!!")
      },
      error: (error) => {
        console.error('Error:', error);
        alert("Something Went Wrong!")
      }
    });


  }

  sendMessage() {
    if (!this.userInput.trim()) return;


    const currentInput = this.userInput;
    this.isLoading1 = true;
    const request: ChatRequest = {
      user_id: 42,
      input: currentInput
    };
    this.http.post<ChatResponse>(`${this.apiBaseUrlAI}/language_chat/language-learning`, request).subscribe({
      next: (response) => {
        this.corrections = response.corrections;
        this.aiReply = response.ai_reply;
        this.saveChatHistory();
        this.userInput = '';
      },
      error: (error) => {
        console.error('Error:', error);
        this.aiReply = 'Sorry, there was an error processing your message.';
      },
      complete: () => {
        this.isLoading1 = false;
      }
    });
  }
}
