const mongoose = require ('mongoose');
const slugify = require("slugify");

const blogPostSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [50, 'Title cannot exceed 50 characters'],
    set: function (value) {
      this.titleSlug = slugify(value, { lower: true, trim: true });
      return value;
    },
  },
  imageURL: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v) {
        return /([^\s]+(\.(jpg|png))$)/i.test(v); 
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    maxlength: [100, 'Summary cannot exceed 350 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  postDate: {
    type: Date,
    default: Date.now
  },
  titleSlug: {
    type: String,
    required: [true, 'Title slug is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  }
});

blogPostSchema.index({ title: 'text', summary: 'text', content: 'text' });


module.exports = mongoose.model('BlogPost', blogPostSchema);
