import qrcode
from PIL import Image, ImageDraw
import cv2
import webbrowser
url = "https://ney-roon.github.io/my-portfolio/"


qr = qrcode.QRCode(
    version=5,
    error_correction=qrcode.constants.ERROR_CORRECT_H,

    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')

def make_circle_with_border(img, size, border=6):
    img = img.resize((size, size)).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    img.putalpha(mask)

    bordered_size = size + border * 2
    bordered_img = Image.new("RGBA", (bordered_size, bordered_size), (255, 255, 255, 0))
    draw_border = ImageDraw.Draw(bordered_img)
    draw_border.ellipse((0, 0, bordered_size, bordered_size), fill=(255, 255, 255, 255))
    bordered_img.paste(img, (border, border), img)

    return bordered_img

logo_center = Image.open("logo_center.jpeg") 
logo_corner = Image.open("logo_corner.jpeg")

logo_center = make_circle_with_border(logo_center, 35, border=6)
logo_corner = make_circle_with_border(logo_corner, 45, border=6)


pos_center = ((qr_img.size[0] - logo_center.size[0]) // 2,
              (qr_img.size[1] - logo_center.size[1]) // 2)

pos_corner = (qr_img.size[0] - logo_corner.size[0] - 30,
              qr_img.size[1] - logo_corner.size[1] - 30)

qr_img.paste(logo_center, pos_center, logo_center)
qr_img.paste(logo_corner, pos_corner, logo_corner)

qr_img.save("portfolio_qr_with_borders.png")

img = cv2.imread("portfolio_qr_with_borders.png")
detector = cv2.QRCodeDetector()
data, points, _ = detector.detectAndDecode(img)

if data:
    
     print("Decoded data:", data)
     webbrowser.open(data)
else:
     print("QR code could not be read!")
print("QR code generated successfully with round images!")