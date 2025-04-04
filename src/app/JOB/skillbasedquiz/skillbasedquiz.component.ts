import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface QuizQuestion {
  text: string;
  options: string[];
  correct_answer: string;
}

interface CelebrationItem {
  type: string;
  color: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: number;
  strokeWidth: string;
}

@Component({
  selector: 'app-skillbasedquiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skillbasedquiz.component.html',
  styleUrl: './skillbasedquiz.component.css'
})
export class SkillbasedquizComponent implements OnInit,OnDestroy {

  //celebrations//
  showCelebration = false;
  celebrationItems: CelebrationItem[] = [];
  // Quiz state variables
  skillName: string = '';
  skillLevel: string = '';
  questions: QuizQuestion[] = [];

  // UI state variables
  loading: boolean = true;
  quizCompleted: boolean = false;
  errorMessage: string | null = null;

  // Quiz progress tracking
  currentQuestionIndex: number = 0;
  selectedAnswer: string | null = null;
  correctAnswers: number = 0;

  // Funny loading statements
  loadingStatements: string[] = [
    "Polishing our quiz questions...",
    "Brewing some brain-teasing challenges...",
    "Unleashing the knowledge kraken...",
    "Quantum-entangling your quiz experience...",
    "Calibrating our intelligence sensors..."
  ];
  currentLoadingStatement: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.selectRandomLoadingStatement();
    this.route.queryParams.subscribe(params => {
      this.skillName = params['skillName'];
      this.skillLevel = params['skillLevel'];

      // ['Beginner', 'Intermediate', 'Advanced'] only accepted by AIML


      switch (this.skillLevel) {
        case 'Average':
          this.skillLevel = 'Beginner';
          break;
        case 'Skilled':
          this.skillLevel = 'Intermediate';
          break;
        case 'Expert':
          this.skillLevel = 'Advanced';
          break;
        default:
          this.skillLevel = 'Beginner';
      }

      this.callGenerateQuizApi();
    });

    this.generateCelebrationItems();
  }
 
  ngOnDestroy(){
    this.stopDevToolsDetection();
  }

  //celebrations//

  generateCelebrationItems() {
    const types = ['flower', 'star', 'circle', 'heart', 'triangle'];
    const colors = ['#ff9999', '#ffcc99', '#99ff99', '#99ccff', '#cc99ff'];

    for (let i = 0; i < 50; i++) {
      this.celebrationItems.push({
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 2}s`,
        animationDelay: `${Math.random() * 2}s`,
        size: 15 + Math.random() * 20,
        strokeWidth: (Math.random() * 2 + 1).toFixed(1)
      });
    }
  }

  triggerCelebration() {
    this.showCelebration = true;
    setTimeout(() => {
      this.showCelebration = false;
    }, 6000);
  }

  getCoordinate(index: number, total: number, type: 'sin' | 'cos'): number {
    const angle = (index / total) * 2 * Math.PI;
    return type === 'sin' ? Math.sin(angle) : Math.cos(angle);
  }
  //////////////////////////////////////////////////////////////
  selectRandomLoadingStatement(): void {
    this.currentLoadingStatement =
      this.loadingStatements[Math.floor(Math.random() * this.loadingStatements.length)];
  }

  callGenerateQuizApi(): void {
    // Reset error state
    this.errorMessage = null;
    this.loading = true;

    const apiUrl = 'http://localhost:8000/skill_test_quiz';
    const body = {
      skill_name: this.skillName,
      skill_level: this.skillLevel || 'Beginner'
    };

    console.log(body)

    


    this.http.post<{ questions: any[] }>(apiUrl, {
      "skill_name": this.skillName,
      "skill_level":this.skillLevel
    }).subscribe({
      next: (response) => {
        if (response.questions && response.questions.length > 0) {
          this.questions = response.questions;
          this.loading = false;
          console.log(response.questions)
        } else {
          this.handleQuizGenerationError('Not enough questions could be generated. Please try again.');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.handleQuizGenerationError(this.getErrorMessage(error));
      }
    });
  }
  // Helper method to extract meaningful error message
  getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Error: ${error.error.message}`;
    } else {
      // Server-side error
      return `Server Error: ${error.status} - ${error.statusText}`;
    }
  }

  // Error handling method
  handleQuizGenerationError(message: string): void {
    this.loading = false;
    this.errorMessage = message;
  }

  // Retry quiz generation
  retryQuizGeneration(): void {
    this.errorMessage = null;
    this.callGenerateQuizApi();
  }

  selectAnswer(option: string): void {
    this.selectedAnswer = option;
  }

  nextQuestion(): void {
    if (this.selectedAnswer) {
      const correctIndex = ["A", "B", "C", "D"].indexOf(this.currentQuestion.correct_answer);
      const correctAnswerText = this.currentQuestion.options[correctIndex];
  
  
      // Compare the selected answer with the correct answer text
      if (this.selectedAnswer === correctAnswerText) {
        this.correctAnswers++;
      }

      this.currentQuestionIndex++;
      this.selectedAnswer = null;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedAnswer = null;
    }
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }
  submitQuiz(): void {
    if (this.selectedAnswer === this.currentQuestion.correct_answer) {
      this.correctAnswers++;
    }

    this.quizCompleted = true;

    // Trigger celebration if score is good (>=80%)
    if (this.calculatePercentage() >= 80) {
      this.triggerCelebration();
    }
  }

  calculatePercentage(): number {
    return Math.round((this.correctAnswers / this.questions.length) * 100);
  }

  getResultMessage(): string {
    const percentage = this.calculatePercentage();

    if (percentage >= 80) {
      return this.getExcellentMessage();
    } else if (percentage >= 60) {
      return this.getGoodMessage();
    } else {
      return this.getPoorMessage();
    }
  }

  getExcellentMessage(): string {
    const excellentMessages = [
      "Wow! You're a true knowledge champion! 🏆",
      "Absolutely stellar performance! You're basically a genius! 🌟",
      "Mind-blowing score! Einstein would be impressed! 🧠"
    ];
    return excellentMessages[Math.floor(Math.random() * excellentMessages.length)];
  }

  getGoodMessage(): string {
    const goodMessages = [
      "Nice work! You're on the right track! 👍",
      "Solid performance! Keep learning and growing! 📈",
      "Good job! Just a bit more and you'll be a pro! 🚀"
    ];
    return goodMessages[Math.floor(Math.random() * goodMessages.length)];
  }

  getPoorMessage(): string {
    const poorMessages = [
      "Oops! Looks like you need some more practice! 📚",
      "Don't worry, every quiz is a learning opportunity! 💡",
      "Not quite there, but Rome wasn't built in a day! 🛠️"
    ];
    return poorMessages[Math.floor(Math.random() * poorMessages.length)];
  }

  canSaveResults(): boolean {
    return this.calculatePercentage() >= 60;
  }

  restartQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.correctAnswers = 0;
    this.quizCompleted = false;
  }

  saveResults(): void {
    if (this.canSaveResults()) {
      alert(`Results saved: ${this.correctAnswers}/${this.questions.length}`);
      // Implement actual save logic here
    }
  }

  private devToolsInterval: any;
  private resizeListener: (() => void) | undefined;
    // Start DevTools detection logic
  private startDevToolsDetection(): void {
    // Detect DevTools using timing (debugger)
    this.devToolsInterval = setInterval(() => {
      const start = performance.now();
      debugger; // Pauses if DevTools is open
      const duration = performance.now() - start;
 
      if (duration > 100) {
        this.handleCheatingDetected();
      }
    }, 1000);
 
    // Detect DevTools using window resize
    this.resizeListener = () => {
      const threshold = 100;
      if (
        Math.abs(window.outerHeight - window.innerHeight) > threshold ||
        Math.abs(window.outerWidth - window.innerWidth) > threshold
      ) {
        this.handleCheatingDetected();
      }
    };
 
    window.addEventListener('resize', this.resizeListener);
  }
 
  // Stop DevTools detection logic
  private stopDevToolsDetection(): void {
    if (this.devToolsInterval) {
      clearInterval(this.devToolsInterval);
      this.devToolsInterval = null;
    }
 
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
 
  // Handle actions when cheating is detected
  private handleCheatingDetected(): void {
    alert('Cheating detected! You are not allowed to use DevTools.');
    // Optionally, navigate away or restrict the quiz
    // Example: Navigate to another page
    // window.location.href = '/warning';
  }
 
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault(); // Disable right-click
  }
 
  @HostListener('window:keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey && (event.key === 'i' || event.key === 'I' || event.key === 'j' || event.key === 'J' || event.key === 'u' || event.key === 'U' || event.key === 's' || event.key === 'S')) {
    event.preventDefault();
  }
 
  if (event.key === 'F12') {
    event.preventDefault();
  }
}
 
}
