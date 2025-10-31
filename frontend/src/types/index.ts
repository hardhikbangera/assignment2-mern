export type Experience = { id:number; name:string; location:string; description?:string; price:number; image_url?:string; category?:string; }
export type Slot = { id:number; experience_id:number; date:string; time:string; available_slots:number; total_slots:number; }
export type Booking = { id:number; booking_reference:string; total:number; }