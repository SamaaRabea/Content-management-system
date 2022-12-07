import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  freshnessList = ['New Brand', 'Second Hand', 'Refurbished'];
  productForm!: FormGroup;
  actionButton:string ="Save"
  constructor(
    private formBilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBilder.group({
      ProductName: ['', Validators.required],
      ProductCategory: ['', Validators.required],
      date: ['', Validators.required],
      Freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
    });
    if(this.editData){
      this.actionButton="Update"
      this.productForm.controls['ProductName'].setValue(this.editData.ProductName);
      this.productForm.controls['ProductCategory'].setValue(this.editData.ProductCategory);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['Freshness'].setValue(this.editData.Freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
    }
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id).subscribe({
      next: (res) => {
        alert('product updated successfully');
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert('error while updating product');
      },
  })
  }
  AddProduct() {
    if(!this.editData){
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('product added successfully');
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert('error while adding product');
          },
        });
      }
    }else{
      this.updateProduct();
    }
  }
}
