import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { PRODUCTS, product, categoryList, prodCate, subBrand, SUBBRAND } from './app.component'
import { map, take, toArray, mergeAll, tap, distinct, pluck, groupBy, mergeMap, reduce, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getProducts(): Observable<product[]>{
    return of(PRODUCTS);
  }

  getProduct(key: string) {
    return this.getProducts().pipe(
      tap(x=>x),
      map((product: product[])=>product.find(product => product.name === key))
    );
  }

  gethotProduct() {
    return this.getProducts().pipe(
      //tap(x=>x),
      map((product: product[])=>product.filter(product => product.hot === true)),
      mergeAll(),
      take(5),
      toArray()
    );
  }

  getbestsaleProduct() {
    return this.getProducts().pipe(
      //tap(x=>x),
      map((product: product[])=>product.sort((a,b)=>b.cop-a.cop)),
      mergeAll(),
      take(5),
      toArray()
    ); 
  }

  getCategoryList(): Observable<prodCate[]>{
    return of(categoryList);
  }

  getCategory(){
    return this.getCategoryList().pipe(
      mergeAll(),
      groupBy(p=>p.category, p=>p.subCate),
      mergeMap(grp$=>grp$.pipe(
        reduce((acc,cur)=>[...acc,cur],[`${grp$.key}`])
      )),
      map(arr=>({category: arr[0], subCate: arr.slice(1)})),
      toArray()
    )
  }

  getProdByID(x: any){
    return this.getCategoryList().pipe(
      tap(z=>z),
      mergeAll(),
      filter(key => key.subCate === x),
      map(y => { return y.id })
    )
  }

  getProductByCategory(x: number){
    return this.getProducts().pipe(
      map((product: product[]) => product.filter(product => product.cateID === x))
    )
  }

  // getProd(){
  //   return this.getCategoryList().pipe(
  //     tap(x=>x),
  //     mergeAll(),
  //     filter(key=>key.subCate === 'TVs'),
  //     map(y=>{return y.id}),
  //   )
  // }

  getBrandOfProduct(x: number){
    return this.getProductByCategory(x).pipe(
      mergeAll(),
      distinct(list=>list.brand),
      map(data => {
        return data.brand
      }),
      toArray()
    )
  }

  getBrandOfProductByValue(key: string, id: number){
    return this.getBrandOfProduct(id).pipe(
      mergeAll(),
      filter(brand => brand == key),
      toArray()
    )
  }

  getSubAttribute(): Observable<SUBBRAND[]>{
    return of(subBrand)
  }

  // getSubBrandTitleOfProduct(){
  //   return this.getSubAttribute().pipe(
  //     mergeAll(),
  //     groupBy(p => p.parentId, p=> p.id),
  //     mergeMap(grp=>grp.pipe(
  //       reduce((acc,cur)=>[...acc,cur],[`$grp.key`])
  //     )),
  //     map(arr=>({brd: arr})),
  //     toArray()
  //   )
  // }

  getProductByBrandAttr(attr: number, brand: string, id: number ){
    if(brand !== ''){
      return this.getProductByCategory(id).pipe(
        mergeAll(),
        filter(product => product.brand == brand),
        filter(product => product.subBrandId == attr),
        toArray()
      )
    } else {
      return this.getProductByCategory(id).pipe(
        mergeAll(),
        //filter(product => product.brand == brand),
        filter(product => product.subBrandId == attr),
        toArray()
      )
    }
    
  }

  // getProductByBrandAttr(brand, attr){
  //   if (brand !== ''){

  //   }
  // }
}
