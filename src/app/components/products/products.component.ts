import { Component } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  //allProducts$ = this.productsService.allProducts$;
  allProducts: Product[] = [];

  constructor(private productsService: ProductsService) {}
  
  ngOnInit() {
    this.productsService.allProducts$.subscribe(
      products => {
        this.allProducts = products;
        console.log('products', products); // Log the fetched products to the console
      },
      error => console.log('error fetching products', error)
    );
  }
}
