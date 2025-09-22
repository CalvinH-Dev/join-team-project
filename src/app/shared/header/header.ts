import { Component } from '@angular/core';
import { Button } from '../components/button/button';
import { InputField } from '../components/input-field/input-field';
import { Toast } from '../components/toast/toast';

@Component({
  selector: 'app-header',
  imports: [Button, InputField, Toast],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  onAddContact(): void {
    console.log('Add contact clicked!');
    // Test function
  }
}
