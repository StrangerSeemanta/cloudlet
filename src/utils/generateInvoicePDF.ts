import { SoldProductDataType } from "@/firebase/SoldProductFirebase";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/assets/logo.png";
import paidSeal from "@/assets/paid_seal.png";
const generateInvoicePDF = (sale: SoldProductDataType) => {
  const doc = new jsPDF({ orientation: "portrait", format: "a4" });

  // Store Name (Bold & Centered)
  const image = logo;
  doc.addImage(image, "png", 24, 10, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CLOUDLET", 105, 20, { align: "center" });

  // Invoice Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Sales Invoice", 105, 30, { align: "center" });

  // Divider Line
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);

  // Invoice & Date Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("red");
  doc.text(`Invoice No: ${sale.timestamp}`, 14, 45);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 45);
  //   Product Details;
  doc.setFontSize(12);

  doc.setTextColor("green");
  doc.text(`Product Id: ${sale.productId.toUpperCase()}`, 14, 55);
  doc.text(`Product Name: ${sale.productName.toUpperCase()}`, 14, 65);

  // Buyer Info Section
  doc.setTextColor("green");
  doc.text(`Buyer Name: ${sale.buyer_name}`, 140, 55);
  doc.text(`Buyer Phone: ${sale.buyer_phoneNo}`, 140, 65);

  doc.setFont("helvetica", "normal");
  doc.setTextColor("black");
  // Table Headers & Product Details
  const tableColumn = [
    "Product ID",
    "Product Name",
    "Quantity",
    "Price",
    "Total",
  ];
  const tableRows = [
    [
      sale.productId,
      sale.productName,
      sale.selling_quantity,
      `${sale.selling_price} BDT`,
      `${Number(sale.selling_quantity) * Number(sale.selling_price)} BDT`,
    ],
  ];

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    theme: "grid", // Adds a border to table
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [0, 102, 204], textColor: 255 }, // Blue header
  });

  // Y Position After Table
  const finalY = 60 + tableRows.length * 60 + 10; // Approximate table height

  // Payment Summary
  doc.setFont("helvetica", "bold");

  //   Seller SIgn
  doc.setFont("Times", "italic", "bold");
  doc.setFontSize(16);
  doc.text(sale.seller_name, 14, finalY + 21, { align: "left" });
  doc.setLineWidth(0.8);
  doc.line(14, finalY + 24, 70, finalY + 24);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  doc.text(`Seller Sign:`, 14, finalY + 30, { align: "left" });

  // Paid Seal
  if (sale.status === "paid") {
    doc.addImage(paidSeal, "png", 90, finalY, 40, 40);
  }

  doc.setFont("helvetica", "bold");

  doc.text("Payment Summary:", 140, finalY, { align: "left" });

  doc.setTextColor("blue");

  doc.text(`Total Amount: ${sale.total_sold} BDT`, 140, finalY + 10, {
    align: "left",
  });
  doc.setTextColor("green");

  doc.text(`Paid Amount: ${sale.received_amount} BDT`, 140, finalY + 20, {
    align: "left",
  });
  doc.setTextColor("red");

  doc.text(`Pending Amount: ${sale.pending_amount} BDT`, 140, finalY + 30, {
    align: "left",
  });

  doc.setTextColor("green");
  doc.setFont("Courier", "normal", "bold");
  // Footer Section
  doc.setLineWidth(0.5);
  doc.line(14, finalY + 60, 196, finalY + 60);
  doc.setFontSize(20);
  doc.text("Thank you for your business!", 105, finalY + 70, {
    align: "center",
  });
  if (sale.installment_history.length >= 1) {
    doc.setFontSize(25);
    doc.setTextColor("blue");
    doc.setFont("Helvetica", "bold");
    doc.text("See Installment Receipt Below", 105, finalY + 110, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.setTextColor("black");

    sale.installment_history.forEach((installment, i) => {
      const nPage = i + 1;
      // Create page after each 3 entry
      if (i % 3 === 0) {
        doc.addPage("a4", "p");
      }

      doc.addImage(image, "png", 160, (i % 3) * 80 + 35, 30, 30);

      doc.setFontSize(20);
      doc.setTextColor("Blue");
      doc.text(
        `Receipt of Installment: ${nPage.toString()}`,
        104,
        (i % 3) * 80 + 20
      );
      doc.setDrawColor("black");

      doc.setLineWidth(0.5);
      doc.line(14, (i % 3) * 80 + 25, 196, (i % 3) * 80 + 25);
      doc.setFontSize(14);
      doc.setTextColor("green");

      doc.text(
        `Date: ${installment.repay_date.toString()}`,
        14,
        (i % 3) * 80 + 35
      );
      doc.setTextColor("black");
      doc.text(
        `Total Amount: ${sale.total_sold.toString()} Taka`,
        14,
        (i % 3) * 80 + 50
      );
      doc.text(
        `Received Amount: ${installment.amount.toString()} Taka`,
        14,
        (i % 3) * 80 + 60
      );
      doc.setDrawColor("red");
      doc.setTextColor("red");

      doc.text(
        `Pending till this date: ${
          Number(sale.total_sold) - Number(installment.amount)
        } Taka`,
        14,
        (i % 3) * 80 + 70
      );
      doc.setLineWidth(0.5);
      doc.line(14, (i % 3) * 80 + 80, 196, (i % 3) * 80 + 80);
    });
  }

  // Save PDF
  doc.save(`invoice_${sale.timestamp}.pdf`);
};

export default generateInvoicePDF;
