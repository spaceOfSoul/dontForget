from PIL import Image
import os

def resize_image(input_path, output_path, size):
    try:
        with Image.open(input_path) as img:
            img = img.resize(size, Image.ANTIALIAS)
            img.save(output_path, "PNG")
        print(f"Image resized successfully and saved to {output_path}")
    except Exception as e:
        print(f"Could not resize the image. Error: {e}")

if __name__ == "__main__":
    dir = "preview"
    output_size = (640, 400)

    for filename in os.listdir(dir):
        input_path = os.path.join(dir, filename)
        output_path = os.path.join(dir, "resized", filename)
        if not os.path.exists(os.path.join(dir, "resized")):
            os.makedirs(os.path.join(dir, "resized"))
        resize_image(input_path, output_path, output_size)