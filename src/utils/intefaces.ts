import { ELocationType } from './enums'

export interface IItem {
  id: number
  name: string
  uom: IUom
  purchaseUom: IUom
  secondaryUom: IUom
}

export interface IUom {
  id: number
  name: string
}
export interface ICategory {
  id: number
  name: string
}

export interface IPartner {
  id: number
  name: string
  address: string
  phone: string
  email: string
  isCustomer: boolean
  isSupplier: boolean
}

export interface ISalesOrder {
  id: number
  customerId: number
  salesOrderLines: ISalesOrderLine[]
}

export interface ISalesOrderInput {
  customerId: number
  salesOrderLines: ISalesOrderLineInput[]
}

export interface IItemInput {
  name: string
  uomId: number
  purchaseUomId?: number
  secondaryUomId?: number
  categoryId?: number
  customerId?: number
  hasPrinting?: boolean
  isStockable?: boolean
  cylinder?: {
    setCount?: number
    locationId?: number
    width?: number
    perimeter?: number
    sharedCylinders?: {
      cylinderSetId?: number
      colors?: string
    }
  }
}

export interface ICategoryInput {
  name: string
}

export interface ISalesOrderLine {
  id: number
  salesOrderId: number
  itemId: number
  quantity: number
  unitPrice: number
  taxRate: string
  note: string
  deliveryDate: Date
}

export interface ISalesOrderLineInput {
  itemId: number | undefined
  quantity: number
  unitPrice: number
  taxRate: string
  note: string
  deliveryDate: Date | undefined
}

export interface GetResponse<T> {
  data: T[]
  meta: {
    total: number
    currentPage: number
    lastPage: number
  }
}

export interface IWarehouse {
  id: number
  name: string
}

export interface ILocation {
  id: number
  name: string
  locationType: ELocationType
  warehouseId: number
  parentId: number
}

export interface ILocationInput {
  name: string
  locationType: ELocationType
  warehouseId: number
  parentId: number
}
