/*
  # Add Arabic Name and Description Fields

  Adds name_ar and description_ar columns to products and categories tables
  to support Arabic language display.
*/

-- Add Arabic columns to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS name_ar text,
  ADD COLUMN IF NOT EXISTS description_ar text;

-- Add Arabic columns to categories
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS name_ar text,
  ADD COLUMN IF NOT EXISTS description_ar text;

-- Update category Arabic translations
UPDATE categories SET
  name_ar = 'العجلات والإطارات',
  description_ar = 'عجلات وإطارات بديلة عالية الجودة لجميع أنواع الكراسي المتحركة'
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE categories SET
  name_ar = 'الوسائد والمقاعد',
  description_ar = 'حلول جلوس مريحة وداعمة'
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE categories SET
  name_ar = 'الفرامل والمحاور',
  description_ar = 'مكونات الفرامل والمحاور الأساسية'
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

UPDATE categories SET
  name_ar = 'الإكسسوارات',
  description_ar = 'إكسسوارات مفيدة لتحسين كرسيك المتحرك'
WHERE id = '550e8400-e29b-41d4-a716-446655440004';

-- Update product Arabic translations
UPDATE products SET
  name_ar = 'إطار هوائي ممتاز 24 بوصة',
  description_ar = 'إطار هوائي متين بقبضة ممتازة وركوب سلس'
WHERE name = 'Premium Pneumatic Tire 24"';

UPDATE products SET
  name_ar = 'إطار بولي يوريثان صلب 22 بوصة',
  description_ar = 'إطار صلب خالٍ من الصيانة، تصميم مقاوم للثقب'
WHERE name = 'Solid Polyurethane Tire 22"';

UPDATE products SET
  name_ar = 'طقم عجلات سريع الفك',
  description_ar = 'طقم عجلات سهل الفك لسهولة النقل'
WHERE name = 'Quick Release Wheel Set';

UPDATE products SET
  name_ar = 'وسادة كرسي متحرك جيل',
  description_ar = 'وسادة جيل لتخفيف الضغط لأقصى قدر من الراحة'
WHERE name = 'Gel Wheelchair Cushion';

UPDATE products SET
  name_ar = 'وسادة مقعد من الإسفنج الذاكر',
  description_ar = 'الإسفنج الذاكر المريح يوفر دعمًا فائقًا'
WHERE name = 'Memory Foam Seat Cushion';

UPDATE products SET
  name_ar = 'وسادة دعم الظهر',
  description_ar = 'دعم قطني قابل للتعديل لراحة محسّنة'
WHERE name = 'Backrest Support Pad';

UPDATE products SET
  name_ar = 'مجموعة فرامل طبلية',
  description_ar = 'نظام فرامل طبلية عالي الأداء'
WHERE name = 'Drum Brake Assembly';

UPDATE products SET
  name_ar = 'ذراع فرامل سريع التوقف',
  description_ar = 'ذراع فرامل سهل الاستخدام بتصميم مريح'
WHERE name = 'Quick-Stop Brake Lever';

UPDATE products SET
  name_ar = 'طقم محاور ثقيلة الاستخدام',
  description_ar = 'محاور مقواة لمتانة محسّنة'
WHERE name = 'Heavy-Duty Axle Set';

UPDATE products SET
  name_ar = 'حامل كوب قابل للتركيب',
  description_ar = 'حامل كوب عالمي يناسب معظم الكراسي المتحركة'
WHERE name = 'Cup Holder Attachment';

UPDATE products SET
  name_ar = 'حقيبة تخزين بجيوب',
  description_ar = 'حل تخزين متعدد الأقسام'
WHERE name = 'Storage Bag with Pockets';

UPDATE products SET
  name_ar = 'طقم أضواء LED للسلامة',
  description_ar = 'أضواء LED أمامية وخلفية للرؤية'
WHERE name = 'LED Safety Light Set';

UPDATE products SET
  name_ar = 'وسادات مساند ذراع مريحة',
  description_ar = 'مساند ذراع مبطنة ناعمة للراحة الممتدة'
WHERE name = 'Comfort Armrest Pads';

UPDATE products SET
  name_ar = 'طقم عجلات مانعة للانقلاب',
  description_ar = 'عجلات أمان مانعة للانقلاب للاستقرار'
WHERE name = 'Anti-Tip Wheel Kit';

UPDATE products SET
  name_ar = 'واقيات الأسلاك (زوج)',
  description_ar = 'واقيات أسلاك زخرفية وقائية'
WHERE name = 'Spoke Guards (Pair)';
