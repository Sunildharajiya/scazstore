import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required:[true , "First Name is required"]
  },
  profilePicture:{
    type:String,
    required:false,
    default:undefined
  },
  LastName:{
    type:String,
    required:[true , "Your Last name is required"]
  },
  userName:{
    type:String,
    required:true,
    match: [/^@?[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'],
    unique: true,
    set: function(value) {
      if (!value) return value;
      const trimmed = value.trim();
      return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
    }
  },
 role:{
    immutable: true ,
    default:"customer",
    type:String,
    required:true
  },
  dob:{
   type:String,
   required:false
  },
  password:{
    type: String,
    required: true,
    minLength: [6, 'Password must be at least 6 characters long']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Automatically converts "User@Mail.com" to "user@mail.com"
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address.']
  },
  mobile: {
    type: String, // String is preferred over Number to preserve leading zeros or country codes (+)
    required: true,
    unique: true,
    trim: true,
    // Allows international E.164 formats (e.g., +1234567890 or 1234567890, minimum 7 digits, max 15)
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid mobile number with country code.']
  },
  secondryMobile:{
    type:String,
    required:false,
    trim: true,
    // Allows international E.164 formats (e.g., +1234567890 or 1234567890, minimum 7 digits, max 15)
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid mobile number with country code.']
  },
  deliveryAddress: {
    fullAddress: {
      type: String,
      required: false,
      trim: true,
      // Prevents empty spaces from passing as a valid address
      minLength: [10, 'Full address must be at least 10 characters long.'] 
    },
    pincode: {
      type: String, // String preserves alphanumeric formats (like UK/US postcodes) and leading zeros
      required: false,
      trim: true,
      // Generic regex matching standard global postcodes/pincodes (alphanumeric, spaces, hyphens, 3-10 chars)
      match: [/^[a-zA-Z0-9\s-]{3,10}$/, 'Please provide a valid pincode or postcode.']
    }
  },
  refreshTokenHash: {
  type: String,
  default: null
}
  
},{ timestamps: true });


//  PRE-SAVE HOOK: Automatically hashes password before saving to Atlas
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return ;

  try {
    const salt = await bcrypt.genSalt(15); // Generate a secure salt
    this.password = await bcrypt.hash(this.password, salt); // Overwrite plain text with hash
  } catch (err) {
    console.error(err);
  }
});

export const User = mongoose.model('User', userSchema);