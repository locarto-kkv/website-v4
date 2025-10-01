import db from "../../lib/db.js";

export const getBlogs = async (req, res) => {
  try {
    const { data: blogs } = await db.from("blogs").select();

    res.status(200).json(blogs);
  } catch (error) {
    console.log("Error in getBlogs controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;

    const { data: blog } = await db.from("blogs").delete().eq("id", blogId);

    res.status(200).json({ message: "Blog Removed Successfully" });
  } catch (error) {
    console.log("Error in removeBlog controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;
    const { name, price, quantity } = req.body;

    const { data: blog } = await db
      .from("blogs")
      .update({ name, price, quantity })
      .eq("id", blogId)
      .select()
      .single();

    res.status(200).json(blog);
  } catch (error) {
    console.log("Error in editBlog controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const { data: blog } = await db.from("blogs").delete().eq("id", blogId);

    res.status(200);
  } catch (error) {
    console.log("Error in deleteBlog controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
