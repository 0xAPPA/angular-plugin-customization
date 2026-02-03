import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  template: `
    <div class="shell">
      <h1>Base App (No Customization)</h1>
      <div class="info-banner">
        <h3>What is this?</h3>
        <p>This is the <strong>baseline reference app</strong> with zero customer customization. It serves as the starting point that all other approaches extend.</p>
        <p><strong>Nothing is customized here.</strong> Compare this with Approaches 1–5 to see what each customization technique adds.</p>
      </div>
    </div>
  `,
  styles: [`
    .shell { max-width: 720px; margin: 40px auto; font-family: system-ui, sans-serif; }
    h1 { margin: 0 0 16px; font-size: 22px; }
    .info-banner {
      background: #f0f4ff;
      border: 1px solid #b3c6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 6px;
      padding: 16px 20px;
      font-size: 14px;
      line-height: 1.6;
      color: #1e293b;
    }
    .info-banner h3 { margin: 0 0 8px; font-size: 15px; color: #1e40af; }
    .info-banner p { margin: 0 0 6px; }
    .info-banner p:last-child { margin-bottom: 0; }
  `],
})
export class AppComponent {}
