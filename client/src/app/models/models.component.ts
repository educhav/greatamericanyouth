import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { ModelsService } from 'src/services/models.service';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  providers: [MessageService, HttpClient]
})
export class ModelsComponent {
  form: FormGroup;
  model: string = "";
  uploading: boolean = false;
  uploaded: boolean = false;
  progress: number = 0;

  video: File | undefined;


  constructor(private modelsService: ModelsService, private authService: AuthService,
    private messageService: MessageService) {
    this.form = new FormGroup({
      model: new FormControl(this.model, [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern("^[a-zA-Z0-9_-]{1,}$")
      ])
    })

  }
  updateVideo() {
    const fileInput = document.getElementById('video-file') as HTMLInputElement;
    this.video = fileInput?.files?.[0];
  }

  submitForm() {
    if (!this.video) {
      this.showError("Must select video to upload.. dumbass")
      return;
    }
    this.uploading = true;
    const formData = new FormData();
    formData.append('modelName', this.form.get('model')?.value);
    formData.append('username', this.authService.getUsername());
    formData.append('video', new Blob([this.video as File], { type: this.video?.type }));

    this.modelsService.postModel(formData).subscribe(event => {
      if ((event as any).type === HttpEventType.UploadProgress) {
        this.progress = Math.round((100 * ((event as any)?.loaded)) / (event as any)?.total);
      }
      else if ((event as any)?.type === HttpEventType.Response) {
        if ((event as any)?.status === 'duplicate') {
          this.showError("Model name is already taken. Be original for once..")
          this.uploading = false;
          return;
        }
        this.showSuccess("Model uploaded successfully!")
        this.uploading = false;
        this.uploaded = true;
      }

    }, error => {
      this.showError(error?.statusText);
      this.uploading = false;
    })
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

}


