import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { API_URL } from 'src/constants/api';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ACCEPT_MESSAGES } from 'src/constants/constants';
import { AuthService } from 'src/services/auth.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { PublishService } from 'src/services/publish.service';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
  providers: [MessageService, ConfirmationService, HttpClient]
})
export class PublishComponent {
  form: FormGroup;
  title: string = "";
  author: string = "";
  urlName: string = "";
  date: Date = new Date();
  content: string = "";
  sections: string[] = [];
  tag: string = "";
  tags: string[] = [];
  uploadedFiles: any[] = [];
  uploadUrl: string = "";

  acceptMessage: string = "";

  sectionFiles: Map<number, File[]> = new Map<number, File[]>();

  avatarFile: File | undefined;
  thumbnailFile: File | undefined;

  subscriptions: Subscription[] = []
  uploading: boolean = false;
  uploaded: boolean = false;
  progress: number = 0;


  showMediaOptions: boolean = false;
  constructor(private messageService: MessageService, private confirmationService: ConfirmationService,
    private authService: AuthService, private publishService: PublishService) {
    this.uploadUrl = API_URL + 'upload'
    this.acceptMessage = ACCEPT_MESSAGES[Math.floor(Math.random() * ACCEPT_MESSAGES.length)]
    this.form = new FormGroup({
      title: new FormControl(this.title, [
        Validators.required,
        Validators.maxLength(255)
      ]),
      author: new FormControl(this.author, [
        Validators.required,
        Validators.maxLength(255)
      ]),
      urlName: new FormControl(this.urlName, [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern("^[a-zA-Z0-9_-]{1,}$")
      ]),
      date: new FormControl(this.date, [
        Validators.required
      ]),
      content: new FormControl(this.content, [
        Validators.required
      ]),
      description: new FormControl(this.content, [
        Validators.required
      ])
    });

  }
  updateSections() {
    this.sections = this.form.get("content")?.value.split("\n\n");
  }
  updateSectionFiles(section: number) {
    const fileInput = document.getElementById('files' + section) as HTMLInputElement;
    this.sectionFiles.set(section, Array.from(fileInput?.files || []));
  }
  updateAvatarFile() {
    const fileInput = document.getElementById('avatar-file') as HTMLInputElement;
    this.avatarFile = fileInput?.files?.[0];
  }
  updateThumbnailFile() {
    const fileInput = document.getElementById('thumbnail-file') as HTMLInputElement;
    this.thumbnailFile = fileInput?.files?.[0];
  }

  addTag() {
    if (!this.tag) return;
    if (this.tags.filter(tag => this.tag === tag).length > 0) return;
    this.tags.push(this.tag);
    this.tag = "";
  }
  removeTag(tag: string) {
    this.tags = this.tags.filter(visibleTag => visibleTag !== tag);
  }

  confirm() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to submit this article?',
      accept: () => {
        this.submitForm();
      }
    });
  }
  submitForm() {
    if (!this.form.valid || !this.avatarFile || !this.thumbnailFile) {
      this.showError("Form is not valid, check to make sure you didn't do anything retarded.. ok?")
      return;
    }
    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append('author', this.form.get('author')?.value);
    formData.append('urlName', this.form.get('urlName')?.value);
    formData.append('date', this.form.get('date')?.value.valueOf().toString());
    formData.append('description', this.form.get('description')?.value);
    formData.append('avatar', new Blob([this.avatarFile as File], { type: this.avatarFile?.type }));
    formData.append('avatarName', this.avatarFile?.name as string);
    formData.append('thumbnail', new Blob([this.thumbnailFile as File], { type: this.thumbnailFile?.type }));
    formData.append('thumbnailName', this.thumbnailFile?.name as string);
    formData.append('username', this.authService.getUsername());


    for (let tag of this.tags) {
      formData.append("tags", tag);
    }
    for (let i = 0; i < this.sections.length; i++) {
      formData.append('sections', this.sections[i]);
      let files = this.sectionFiles.get(i) as File[];
      if (files === null) continue;

      for (let j = 0; j < files?.length; j++) {
        let textBox = document.getElementById('section' + i + '-image' + j) as HTMLInputElement;
        formData.append('sections[' + i + '][' + j + ']', new Blob([files[j]], { type: files[j]?.type }));
        formData.append('names[' + i + '][' + j + ']', files[j]?.name);
        formData.append('texts[' + i + '][' + j + ']', textBox?.value);
      }
    }
    this.uploading = true;
    this.publishService.publishArticle(formData).subscribe(event => {
      if ((event as any).type === HttpEventType.UploadProgress) {
        this.progress = Math.round((100 * ((event as any)?.loaded)) / (event as any)?.total);
      }
      else if ((event as any)?.type === HttpEventType.Response) {
        if ((event as any)?.status === 'duplicate') {
          this.showError("Article has a duplicate url-name. Be original for once..")
          this.uploading = false;
          return;
        }
        this.showSuccess("Article uploaded successfully!")
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

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
