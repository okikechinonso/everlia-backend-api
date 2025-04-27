import PDFDocument from "pdfkit";

export const handleCreateTemplate = async (): Promise<Uint8Array> => {
  const pdfBuffer = await new Promise<Uint8Array>((resolve) => {
    const doc = new PDFDocument();

    doc.text("hello world", 100, 50);
    doc.end();

    // Finalize document and convert to buffer array
    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = new Uint8Array(Buffer.concat(buffers.map(buffer => new Uint8Array(buffer))));
      resolve(pdfData);
    });
  });

  return pdfBuffer;
};