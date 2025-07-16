// Equipment form with AI pre-filled data and validation
// PRD: form_interface: "Mobile-optimized form with sections for identification, condition, specs, pricing"
// PRD: prefill_behavior: "Auto-populate fields from AI extraction with confidence indicators"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Check, 
  CaretDown, 
  Tag, 
  User, 
  Package, 
  ListBullets, 
  Heart, 
  FileText, 
  Barcode, 
  Hash, 
  MapPin, 
  CurrencyDollar, 
  NotePencil,
  Image,
  Camera,
  Upload,
  X,
  ArrowCounterClockwise
} from 'phosphor-react';
import { generateBarcode } from '../utils/barcodeGenerator';

interface EquipmentFormData {
  // Equipment ID section
  name: string;
  brand: string;
  model: string;
  category: string;
  
  // Condition section
  condition: string;
  description: string;
  
  // Specifications section
  specifications: Record<string, any>;
  
  // Financial section
  estimated_value: number;
  current_value: number;
  price_per_day?: number;
  security_deposit?: number;
  
  // Inventory specific
  serial_number: string;
  barcode: string;
  location: string;
  purchase_price: number;
  notes: string;
  
  // Image handling
  images: string[];
  primary_image: string;
  removed_images: string[];
  uploaded_images: string[];
}

interface EquipmentFormProps {
  initialData: Partial<EquipmentFormData>;
  confidenceScores: Record<string, number>;
  onSubmit: (data: EquipmentFormData) => void;
  onCancel: () => void;
}

const conditionOptions = ['new', 'good', 'fair', 'damaged'];
const categoryOptions = [
  'Cameras', 'Lenses', 'Lighting', 'Audio', 'Support & Rigs', 'Accessories'
];

export default function EquipmentForm({ 
  initialData, 
  confidenceScores, 
  onSubmit, 
  onCancel 
}: EquipmentFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EquipmentFormData>({
    defaultValues: initialData
  });
  
  const [images, setImages] = useState<string[]>(initialData.images || []);
  const [primaryImage, setPrimaryImage] = useState<string>(initialData.primary_image || '');
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>(initialData.images || []);

  // Auto-generate barcode on component mount if not provided
  useEffect(() => {
    if (!initialData.barcode) {
      const autoBarcode = generateBarcode();
      setValue('barcode', autoBarcode);
    }
  }, [initialData.barcode, setValue]);

  // Image handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setImages(prev => [...prev, imageUrl]);
          setUploadedImages(prev => [...prev, imageUrl]);
          if (!primaryImage) {
            setPrimaryImage(imageUrl);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setImages(prev => prev.filter(img => img !== imageUrl));
    if (originalImages.includes(imageUrl)) {
      setRemovedImages(prev => [...prev, imageUrl]);
    }
    setUploadedImages(prev => prev.filter(img => img !== imageUrl));
    if (primaryImage === imageUrl) {
      const remainingImages = images.filter(img => img !== imageUrl);
      setPrimaryImage(remainingImages[0] || '');
    }
  };

  const handleUndoRemove = (imageUrl: string) => {
    setRemovedImages(prev => prev.filter(img => img !== imageUrl));
    setImages(prev => [...prev, imageUrl]);
    if (!primaryImage) {
      setPrimaryImage(imageUrl);
    }
  };

  const handleSetPrimary = (imageUrl: string) => {
    setPrimaryImage(imageUrl);
  };

  const renderConfidenceIndicator = (fieldName: string) => {
    // PRD: confidence_indicators: "Purple checkmarks next to AI-filled fields"
    const hasInitialValue = initialData[fieldName as keyof EquipmentFormData];
    const confidence = confidenceScores.extraction || 0;
    
    if (hasInitialValue && confidence > 0.5) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Check size={16} weight="bold" className="text-accent" />
        </div>
      );
    }
    return null;
  };

  const handleFormSubmit = (data: EquipmentFormData) => {
    // Include image data in form submission
    onSubmit({
      ...data,
      images,
      primary_image: primaryImage,
      removed_images: removedImages,
      uploaded_images: uploadedImages
    });
  };

  return (
    <div className="px-5"> {/* 20px (5 * 4px) left/right margin, no other margins/padding */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Equipment ID Section */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg">Equipment Identification</h3>
          
          <div className="relative">
            <label className="flex items-center text-sm font-medium mb-2">
              <Tag size={16} className="mr-2 text-gray-medium" />
              Equipment Name *
            </label>
            <input
              {...register('name', { required: 'Equipment name is required' })}
              className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent pr-10 font-body min-h-touch"
              placeholder="e.g., Canon EOS R5"
            />
            {renderConfidenceIndicator('name')}
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="flex items-center text-sm font-medium mb-2">
                <User size={16} className="mr-2 text-gray-medium" />
                Brand *
              </label>
              <input
                {...register('brand', { required: 'Brand is required' })}
                className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent pr-10 font-body min-h-touch"
                placeholder="Canon"
              />
              {renderConfidenceIndicator('brand')}
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
            </div>

            <div className="relative">
              <label className="flex items-center text-sm font-medium mb-2">
                <Package size={16} className="mr-2 text-gray-medium" />
                Model
              </label>
              <input
                {...register('model')}
                className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent pr-10 font-body min-h-touch"
                placeholder="EOS R5"
              />
              {renderConfidenceIndicator('model')}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <ListBullets size={16} className="mr-2 text-gray-medium" />
              Category *
            </label>
            <div className="relative">
              {/* PRD: custom_dropdowns: "Custom styled dropdowns, not browser default select elements" */}
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent appearance-none bg-white font-body min-h-touch pr-10 cursor-pointer"
                style={{
                  backgroundImage: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none'
                }}
              >
                <option value="">Select category</option>
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {/* PRD: custom_dropdowns: "Styled with Phosphor chevron icons" */}
              <CaretDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-medium pointer-events-none" />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>
        </div>

        {/* Condition Section */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg">Condition & Description</h3>
          
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Heart size={16} className="mr-2 text-gray-medium" />
              Condition *
            </label>
            <div className="relative">
              {/* PRD: custom_dropdowns: "Custom styled dropdowns, not browser default select elements" */}
              <select
                {...register('condition', { required: 'Condition is required' })}
                className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent appearance-none bg-white font-body min-h-touch pr-10 cursor-pointer"
                style={{
                  backgroundImage: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none'
                }}
              >
                {conditionOptions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </option>
                ))}
              </select>
              {/* PRD: custom_dropdowns: "Styled with Phosphor chevron icons" */}
              <CaretDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-medium pointer-events-none" />
              {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition?.message}</p>}
            </div>
          </div>

          <div className="relative">
            <label className="flex items-center text-sm font-medium mb-2">
              <FileText size={16} className="mr-2 text-gray-medium" />
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent font-body resize-none"
              placeholder="Detailed description of the equipment..."
            />
            {renderConfidenceIndicator('description')}
          </div>
        </div>

        {/* Inventory Section */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg">Inventory Details</h3>
          
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Hash size={16} className="mr-2 text-gray-medium" />
              Serial Number
            </label>
            <input
              {...register('serial_number')}
              className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent font-body min-h-touch"
              placeholder="Manufacturer serial number"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Barcode size={16} className="mr-2 text-gray-medium" />
              Internal Barcode (Auto-generated)
            </label>
            <input
              {...register('barcode')}
              className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent font-body min-h-touch bg-gray-light"
              placeholder="Auto-generated barcode"
              readOnly
            />
            <p className="text-xs text-gray-medium mt-1">Barcode is automatically generated for tracking</p>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <MapPin size={16} className="mr-2 text-gray-medium" />
              Storage Location
            </label>
            <input
              {...register('location')}
              className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent font-body min-h-touch"
              placeholder="e.g., Cabinet A, Shelf 2"
            />
          </div>
        </div>

        {/* Financial Section */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg">Financial Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="flex items-center text-sm font-medium mb-2">
                <CurrencyDollar size={16} className="mr-2 text-gray-medium" />
                Purchase Price (₹)
              </label>
              <input
                {...register('purchase_price', { valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent font-body min-h-touch"
                placeholder="0"
              />
            </div>

            <div className="relative">
              <label className="flex items-center text-sm font-medium mb-2">
                <CurrencyDollar size={16} className="mr-2 text-gray-medium" />
                Current Value (₹)
              </label>
              <input
                {...register('current_value', { valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent pr-10 font-body min-h-touch"
                placeholder="0"
              />
              {renderConfidenceIndicator('current_value')}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <NotePencil size={16} className="mr-2 text-gray-medium" />
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-3 border border-black rounded-input focus:outline-none focus:border-accent font-body resize-none"
              placeholder="Additional notes about condition or issues..."
            />
          </div>
        </div>

        {/* Image Section */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-lg">Images</h3>
          
          {/* Primary Image Display */}
          {primaryImage && (
            <div className="relative">
              <label className="flex items-center text-sm font-medium mb-2">
                <Image size={16} className="mr-2 text-gray-medium" />
                Primary Image
              </label>
              <div className="relative w-full h-48 bg-gray-light rounded-input overflow-hidden">
                <img 
                  src={primaryImage} 
                  alt="Primary equipment image" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  Primary
                </div>
              </div>
            </div>
          )}
          
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-light rounded-input overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={`Equipment image ${index + 1}`} 
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleSetPrimary(imageUrl)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imageUrl)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    <X size={12} />
                  </button>
                  {imageUrl === primaryImage && (
                    <div className="absolute bottom-1 left-1 bg-accent text-white px-1 py-0.5 rounded text-xs">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Upload Button */}
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center py-3 px-4 border border-black rounded-button text-black hover:bg-gray-light cursor-pointer min-h-touch">
              <Upload size={16} className="mr-2" />
              Upload Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 border border-black rounded-button text-black hover:bg-gray-light min-h-touch"
              onClick={() => alert('Camera functionality not implemented yet')}
            >
              <Camera size={16} />
            </button>
          </div>
          
          {/* Undo removed images */}
          {removedImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Removed Images (can be restored):</p>
              <div className="flex flex-wrap gap-2">
                {removedImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleUndoRemove(imageUrl)}
                    className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
                  >
                    <ArrowCounterClockwise size={12} />
                    Undo Remove
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-medium rounded-button text-gray-medium hover:bg-gray-light font-medium min-h-touch"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-black text-white py-3 px-4 rounded-button hover:bg-accent font-medium min-h-touch"
          >
            Save Equipment
          </button>
        </div>
      </form>
    </div>
  );
}