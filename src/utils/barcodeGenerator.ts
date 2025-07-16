// Automatic barcode generation utility
// PRD: barcode: "Internal barcode for tracking" - should be auto-generated

export function generateBarcode(prefix: string = 'CAM'): string {
  // Generate a unique barcode with format: CAM-YYYYMMDD-HHMMSS-XXX
  const now = new Date();
  
  // Date components
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Time components
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Random 3-digit suffix
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefix}-${year}${month}${day}-${hours}${minutes}${seconds}-${randomSuffix}`;
}

export function generateSKUBarcode(brand: string, model: string): string {
  // Generate SKU-specific barcode format: SKU-BRAND-MODEL-XXX
  const cleanBrand = brand.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 4);
  const cleanModel = model.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 6);
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `SKU-${cleanBrand}-${cleanModel}-${randomSuffix}`;
}