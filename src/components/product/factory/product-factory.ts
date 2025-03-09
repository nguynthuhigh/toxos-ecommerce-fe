// import { Shop } from "@/interface/product";

// export class ShopFactory {
//   static createShop(data: any): Shop {
//     return {
//       name: data.name,
//       logo: data.logo,
//       description: data.description,
//       phoneNumber: data.phoneNumber,
//       address: data.address,
//       detailedAddress: data.detailedAddress,
//       user: {
//         email: data.user.email,
//         password: data.user.password,
//       },
//     };
//   }
// }
export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  soldCount: number;
}
// Sản phẩm điện tử
export class ElectronicProduct implements Product {
  constructor(
    public id: string,
    public title: string,
    public price: number,
    public image: string,
    public soldCount: number
  ) {}
}
// Sản phẩm quần áo
export class ClothingProduct implements Product {
  constructor(
    public id: string,
    public title: string,
    public price: number,
    public image: string,
    public soldCount: number
  ) {}
}
// Sản phẩm nội thất
export class FurnitureProduct implements Product {
  constructor(
    public id: string,
    public title: string,
    public price: number,
    public image: string,
    public soldCount: number
  ) {}
}
// Factory Method
export class ProductFactory {
  static createProduct(
    type: "electronic" | "clothing" | "furniture",
    id: string,
    title: string,
    price: number,
    image: string,
    soldCount: number
  ): Product {
    switch (type) {
      case "electronic":
        return new ElectronicProduct(id, title, price, image, soldCount);
      case "clothing":
        return new ClothingProduct(id, title, price, image, soldCount);
      case "furniture":
        return new FurnitureProduct(id, title, price, image, soldCount);
      default:
        throw new Error("Invalid product type");
    }
  }
}
