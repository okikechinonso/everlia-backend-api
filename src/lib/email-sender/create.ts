import fs from "fs";
import PDFDocument from "pdfkit";
import fetch from "node-fetch";

interface Invoice {
  invoice: string;
  status: string;
  date: string;
  paymentMethod: string;
  company_info: {
    logo: string;
    vat_number: string;
    company: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    currency: string;
  };
  user_info: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  cart: {
    title: string;
    quantity: number;
    price: number;
  }[];
  subTotal: number;
  vat: number;
  shippingCost: number;
  discount: number;
  total: number;
}

export const handleCreateInvoice = async (invoice: Invoice, path: string): Promise<Buffer> => {
  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc, invoice);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);

    doc.end();

    const buffers: Uint8Array[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });

  return pdfBuffer;
};

const getImage = async (doc: PDFKit.PDFDocument, invoice: Invoice): Promise<Buffer> => {
  const res = await fetch(invoice.company_info.logo);
  const imageBuffer = await res.buffer();
  doc.image(imageBuffer, (doc.page.width - 525) / 2, doc.y, {
    align: "center",
    width: 40,
  });
  return imageBuffer;
};

const generateHeader = (doc: PDFKit.PDFDocument, invoice: Invoice): void => {
  doc
    .fontSize(17)
    .font("Helvetica-Bold")
    .text("Invoice", 50, 50)
    .fontSize(10)
    .font("Helvetica")
    .text("Status :", 50, 70)
    .text(invoice.status, 100, 70)
    .text("VAT Number :", 50, 85)
    .text(invoice.company_info.vat_number, 120, 85)
    .image("cc.png", doc.page.width - 90, doc.y - 75, { width: 40 })
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(invoice.company_info.company, 200, 50, { align: "right" })
    .fontSize(10)
    .font("Helvetica")
    .text(invoice.company_info.address, 200, 65, { align: "right" })
    .text(invoice.company_info.phone, 200, 80, { align: "right" })
    .text(invoice.company_info.email, 200, 95, { align: "right" })
    .text(invoice.company_info.website, 200, 108, { align: "right" })
    .moveDown();
};

const generateCustomerInformation = (doc: PDFKit.PDFDocument, invoice: Invoice): void => {
  const customerInformationTop = 140;
  doc.font("Helvetica-Bold");

  generateTableRow(doc, customerInformationTop, "Date", "Invoice", "Method", "",
    "");
  const customerInformationTopDetail = customerInformationTop + 20;
  doc.font("Helvetica").fontSize(10);
  generateTableRow(
    doc,
    customerInformationTopDetail,
    invoice.date,
    `#${invoice.invoice}`,
    invoice.paymentMethod,
    "",
    ""
  );

  doc
    .font("Helvetica-Bold")
    .text("Invoice To", 200, 140, { align: "right" })
    .font("Helvetica")
    .fontSize(10)
    .text(invoice.user_info.name, 200, 155, { align: "right" })
    .text(invoice.user_info.email, 200, 170, { align: "right" })
    .text(invoice.user_info.phone, 200, 200, { align: "right" })
    .text(invoice.user_info.address, 200, 185, { align: "right" });
};

const generateInvoiceTable = (doc: PDFKit.PDFDocument, invoice: Invoice): void => {
  const invoiceTableTop = 250;

  doc.font("Helvetica-Bold");
  generateTableRow(doc, invoiceTableTop, "Name", "", "Quantity", "Item Price", "Total Price");
  generateHr(doc, invoiceTableTop + 18);
  doc.font("Helvetica");

  invoice.cart.forEach((item, i) => {
    const position = invoiceTableTop + (i + 1) * 30;
    const total = item.price * item.quantity;
    generateTableRow(
      doc,
      position,
      item.title.substring(0, 25),
      "",
      item.quantity.toString(),
      formatCurrency(invoice.company_info.currency, item.price),
      formatCurrency(invoice.company_info.currency, total)
    );
    generateHr(doc, position + 20);
  });

  const subtotalPosition = invoiceTableTop + (invoice.cart.length + 1) * 31;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    subtotalPosition,
    "SubTotal",
    "VAT",
    "Shipping Cost",
    "Discount",
    "Total"
  );
  const paymentOptionPosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paymentOptionPosition,
    formatCurrency(invoice.company_info.currency, invoice.subTotal),
    formatCurrency(invoice.company_info.currency, invoice.vat),
    formatCurrency(invoice.company_info.currency, invoice.shippingCost),
    formatCurrency(invoice.company_info.currency, invoice.discount),
    formatCurrency(invoice.company_info.currency, invoice.total)
  );
};

const generateFooter = (doc: PDFKit.PDFDocument): void => {
  doc
    .fontSize(15)
    .text("Thanks for your order", 50, 750, { align: "center", width: 500 });
};

const generateTableRow = (
  doc: PDFKit.PDFDocument,
  y: number,
  item: string,
  description: string,
  unitCost: string,
  quantity: string,
  lineTotal: string
): void => {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
};

const generateHr = (doc: PDFKit.PDFDocument, y: number): void => {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

const formatCurrency = (currency: string, amount: number): string => {
  return `${currency}${amount.toFixed(2)}`;
};

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}/${month}/${day}`;
};

export default {
  handleCreateInvoice,
};