import re

path = "src/app/services/page.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Match Technologies followed by any apostrophe (', ', ʼ, etc.)
content = re.sub(r"Technologies['\u2019\u2018] IT", "Akoode's IT", content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
