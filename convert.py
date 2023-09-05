import cv2
from PIL import Image

input_file_path = "im.png"

image = cv2.imread(input_file_path)

sizes = [16, 32, 48, 128]

for size in sizes:
    resized_image = cv2.resize(image, (size, size), interpolation=cv2.INTER_AREA)
    
    pil_img = Image.fromarray(cv2.cvtColor(resized_image, cv2.COLOR_BGR2RGB))
    
    output_file_path = f"images/icon{size}.png"
    pil_img.save(output_file_path)

    print(f"Image resized to {size}x{size} and saved as {output_file_path}.")
