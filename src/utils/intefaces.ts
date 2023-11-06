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
