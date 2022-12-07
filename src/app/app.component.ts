import { Component, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import{DialogComponent}from "./dialog/dialog.component"
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'AngularCrud';
  displayedColumns: string[] = ['ProductName', 'ProductCategory','date' ,'Freshness','price', 'comment','Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(){
    this.getAllProduct()
  }
  constructor(public dialog:MatDialog,private api:ApiService){}
  openDialog() {
    this.dialog.open(DialogComponent, {
     width:"30%",
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllProduct()
      }
    });
  }
  deleteProduct(id :number){
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        alert('product deleted successfully');
        this.getAllProduct();
      },
      error: () => {
        alert('error while deleting product');
      }
     })
     
  }
  getAllProduct(){
    this.api.getProduct().subscribe({
      next:(res)=>{
        this.dataSource =new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      },
      error:()=>{
        alert("error while fetching records")
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editProduct(row:any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllProduct()
      }
    });

  }
}
