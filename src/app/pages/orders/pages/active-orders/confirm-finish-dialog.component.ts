import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-confirm-finish-dialog',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <h2 mat-dialog-title>Finish Order</h2>
    <mat-dialog-content>
      Are you sure you want to finish the order?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="onConfirm()">Yes</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmFinishDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmFinishDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
