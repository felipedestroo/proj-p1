import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <div class="calculator-container">
        <h1>Calculadora de IMC</h1>
        <h2>Índice de Massa Corporal</h2>

        <div class="form-group">
          <label for="pesoInput">Peso (kg):</label>
          <input
            id="pesoInput"
            type="number"
            step="0.1"
            min="0"
            [(ngModel)]="pesoStr"
            (input)="atualizarValores()"
            placeholder="Ex: 70.7"
          />
        </div>

        <div class="form-group">
          <label for="alturaInput">Altura (m):</label>
          <input
            id="alturaInput"
            type="number"
            step="0.01"
            min="0"
            [(ngModel)]="alturaStr"
            (input)="atualizarValores()"
            placeholder="Ex: 1.74"
          />
        </div>

        <div class="button-group">
          <button
            class="btn btn-primary"
            (click)="calcularIMC()"
            [disabled]="!podeCalcular()"
          >
            CALCULAR
          </button>
          <button class="btn btn-secondary" (click)="limparCampos()">
            LIMPAR
          </button>
        </div>

        <div *ngIf="resultado >= 0" class="result-container">
          <h2>Seu IMC: {{ resultado }}</h2>
          <p class="classification" [ngStyle]="{ 'color': corClassificacao }">
            {{ classificacao }}
          </p>

          <div class="imc-categories">
            <p><strong>Categorias do IMC:</strong></p>
            <div class="category abaixoDoPeso-text">
              Abaixo do Peso: &lt; 18.5
            </div>
            <div class="category normal-text">
              Peso Normal: 18.5 - 24.9
            </div>
            <div class="category overweight-text">
              Sobrepeso: 25 - 29.9
            </div>
            <div class="category obese-text">
              Obesidade: ≥ 30
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .app-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(to right, #093637, #44a08d);
          font-family: "Segoe UI", Roboto, Arial, sans-serif;
          margin: 0;
          overflow: hidden;
      }

      .calculator-container {
        width: 100%;
        max-width: 550px;
        padding: 35px;
        background-color: #fff;
        border-radius: 24px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 2px solid transparent;
        background-clip: padding-box;
        position: relative;
      }

      .calculator-container:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      }

      h1 {
        text-align: center;
        color: #093637;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      h2 {
        text-align: center;
        color: #44a08d;
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 3px solid #f0f4f8;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      .form-group {
        margin-bottom: 25px;
        position: relative;
      }

      label {
        display: block;
        margin-bottom: 10px;
        font-weight: 600;
        color: #444;
        font-size: 16px;
      }

      input {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e0e7ff;
        border-radius: 12px;
        font-size: 16px;
        box-sizing: border-box;
        background-color: #f8faff;
        transition: border-color 0.3s, box-shadow 0.3s;
      }

      input:focus {
        outline: none;
        border-color: #44a08d;
        box-shadow: 0 0 0 4px rgba(68, 160, 141, 0.15);
        background-color: #fff;
      }

      .button-group {
        display: flex;
        gap: 18px;
        margin-bottom: 30px;
      }

      .btn {
        flex: 1;
        padding: 14px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-primary {
        background: #44a08d;
        color: #fff;
        box-shadow: 0 4px 15px rgba(9, 54, 55, 0.3);
      }

      .btn-primary:hover:not(:disabled) {
        background: #378a76;
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(9, 54, 55, 0.4);
      }

      .btn-secondary {
        background-color: #f1f5f9;
        color: #475569;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      }

      .btn-secondary:hover {
        background-color: #e2e8f0;
        transform: translateY(-3px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
      }

      .result-container {
        margin-top: 30px;
        padding: 25px;
        background-color: #fffc;
        border-radius: 16px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }

      .result-container h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #2d3748;
        font-size: 26px;
        font-weight: 700;
      }

      .classification {
        text-align: center;
        font-weight: 700;
        font-size: 22px;
        margin-bottom: 30px;
        padding: 10px;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.7);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
      }

      .imc-categories {
        font-size: 15px;
        margin-top: 25px;
        background-color: #fff;
        padding: 20px;
        border-radius: 14px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }

      .imc-categories p {
        margin: 0 0 15px 0;
        font-size: 16px;
        font-weight: 600;
        color: #2d3748;
      }

      .category {
        margin: 8px 0;
        padding: 12px 16px;
        border-radius: 10px;
        transition: all 0.3s ease;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .category:hover {
        transform: translateX(8px);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      }

      .abaixoDoPeso-text {
        color: #3b82f6;
        background-color: rgba(59, 130, 246, 0.1);
        border-left: 4px solid #3b82f6;
      }
      .normal-text {
        color: #10b981;
        background-color: rgba(16, 185, 129, 0.1);
        border-left: 4px solid #10b981;
      }
      .overweight-text {
        color: #f59e0b;
        background-color: rgba(245, 158, 11, 0.1);
        border-left: 4px solid #f59e0b;
      }
      .obese-text {
        color: #ef4444;
        background-color: rgba(239, 68, 68, 0.1);
        border-left: 4px solid #ef4444;
      }
    `
  ]
})
export class AppComponent {
  public pesoStr: string = '';
  public alturaStr: string = '';

  public peso: number = 0;
  public altura: number = 0;
  public resultado: number = -1;
  public classificacao: string = '';
  public corClassificacao: string = '';

  public atualizarValores(): void {
    this.peso = parseFloat(this.pesoStr) || 0;
    this.altura = parseFloat(this.alturaStr) || 0;
  }

  public podeCalcular(): boolean {
    return this.peso > 0 && this.altura > 0;
  }

  public calcularIMC(): void {
    if (!this.podeCalcular()) {
      return;
    }
    const imc = this.peso / (this.altura * this.altura);
    this.resultado = parseFloat(imc.toFixed(1));
    this.definirClassificacao();
  }

  private definirClassificacao(): void {
    if (this.resultado < 18.5) {
      this.classificacao = 'Abaixo do Peso';
      this.corClassificacao = '#3b82f6';
    } else if (this.resultado < 25) {
      this.classificacao = 'Peso Normal';
      this.corClassificacao = '#10b981';
    } else if (this.resultado < 30) {
      this.classificacao = 'Sobrepeso';
      this.corClassificacao = '#f59e0b';
    } else {
      this.classificacao = 'Obesidade';
      this.corClassificacao = '#ef4444';
    }
  }

  public limparCampos(): void {
    this.pesoStr = '';
    this.alturaStr = '';
    this.peso = 0;
    this.altura = 0;
    this.resultado = -1;
    this.classificacao = '';
    this.corClassificacao = '';
  }
}
