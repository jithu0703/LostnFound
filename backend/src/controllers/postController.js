import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  try {
    const { type, itemName, description, date } = req.body;

    let parsedLocation = undefined;
    if (req.body.location) {
      try {
        parsedLocation = JSON.parse(req.body.location);
      } catch (e) {
        parsedLocation = { block: req.body.location, floor: "", room: "" };
      }
    }

    if (!type || !itemName || !description || !date) {
      return res.status(400).json({
        message: 'Type, itemName, description, and date are required'
      });
    }

    //  Cloudinary URL should come from middleware/controller
    const imageUrl = req.fileUrl || req.body.imageUrl;

    const newPost = new Post({
      userId: req.user._id,
      type,
      itemName,
      description,
      imageUrl,
      location: parsedLocation,
      date
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { search, type } = req.query;

    let filter = {};

    // Filter by type (lost / found)
    if (type) {
      filter.type = type;
    }

    // Search by itemName (case-insensitive)
    if (search) {
      filter.itemName = { $regex: search, $options: "i" };
    }

    const posts = await Post.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 }); // latest first

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name email phone');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};
