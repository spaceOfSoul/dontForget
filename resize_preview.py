from PIL import Image

def resize_image(input_path, output_path, size):
    try:
        with Image.open(input_path) as img:
            img = img.resize(size, Image.ANTIALIAS)
            img.save(output_path, "PNG")
        print(f"Image resized successfully and saved to {output_path}")
    except Exception as e:
        print(f"Could not resize the image. Error: {e}")
