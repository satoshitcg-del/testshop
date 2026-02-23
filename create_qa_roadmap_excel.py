import pandas as pd
import sys
sys.stdout.reconfigure(encoding='utf-8')

print('Creating Excel from roadmap.sh/qa data...')
print('=' * 60)

# Sheet 1: ภาพรวมหัวข้อหลัก
main_topics = [
    ['พื้นฐาน (Fundamentals)', 'Internet Basics', 'ควรรู้', 'พื้นฐานอินเทอร์เน็ต'],
    ['พื้นฐาน (Fundamentals)', 'HTTP/HTTPS', 'ควรรู้', 'โปรโตคอลเว็บ'],
    ['พื้นฐาน (Fundamentals)', 'What is QA?', 'ควรรู้', 'ความหมายของ QA'],
    ['พื้นฐาน (Fundamentals)', 'Testing Types', 'ควรรู้', 'ประเภทการทดสอบ'],
    ['พื้นฐาน (Fundamentals)', 'SDLC/STLC', 'ควรรู้', 'วงจรพัฒนาและทดสอบ'],
    ['การทดสอบด้วยมือ (Manual)', 'Test Scenarios', 'ควรรู้', 'เขียนสถานการณ์ทดสอบ'],
    ['การทดสอบด้วยมือ (Manual)', 'Test Cases', 'ควรรู้', 'เขียน test case'],
    ['การทดสอบด้วยมือ (Manual)', 'Bug Reporting', 'ควรรู้', 'รายงาน bug'],
    ['การทดสอบด้วยมือ (Manual)', 'Testing Techniques', 'ควรรู้', 'เทคนิคการทดสอบ'],
    ['เครื่องมือ (Tools)', 'Jira', 'ควรรู้', 'จัดการ bug'],
    ['เครื่องมือ (Tools)', 'Postman', 'ควรรู้', 'ทดสอบ API'],
    ['เครื่องมือ (Tools)', 'TestRail', 'ควรรู้', 'จัดการ test case'],
    ['Automation', 'Selenium', 'ควรรู้', 'Web automation ยอดนิยม'],
    ['Automation', 'Cypress', 'ควรรู้', 'Modern web testing'],
    ['Automation', 'Playwright', 'ควรรู้', 'Cross-browser testing'],
    ['Non-Functional', 'Performance Testing', 'ขั้นสูง', 'JMeter, Load Testing'],
    ['Non-Functional', 'Security Testing', 'ขั้นสูง', 'OWASP, Burp Suite'],
    ['CI/CD', 'Jenkins', 'ขั้นสูง', 'CI/CD Pipeline'],
    ['CI/CD', 'GitHub Actions', 'ขั้นสูง', 'Automation workflow'],
]

df_main = pd.DataFrame(main_topics, columns=['หมวดหมู่', 'หัวข้อ', 'ระดับ', 'คำอธิบาย'])

# Sheet 2: รายละเอียด Testing Types
testing_types = [
    ['Functional', 'Unit Testing', 'ทดสอบส่วนเล็กสุดของ code', 'Developer'],
    ['Functional', 'Integration Testing', 'ทดสอบการเชื่อมต่อระหว่าง modules', 'QA/Developer'],
    ['Functional', 'System Testing', 'ทดสอบระบบทั้งหมด', 'QA'],
    ['Functional', 'Acceptance Testing (UAT)', 'ทดสอบก่อนรับมอบ', 'End User/QA'],
    ['Functional', 'Regression Testing', 'ทดสอบซ้ำหลังแก้ไข', 'QA'],
    ['Functional', 'Smoke Testing', 'ทดสอบคร่าวๆ ว่าทำงานได้', 'QA'],
    ['Non-Functional', 'Performance Testing', 'ทดสอบความเร็ว', 'QA'],
    ['Non-Functional', 'Load Testing', 'ทดสอบรับ load ได้เท่าไหร่', 'QA'],
    ['Non-Functional', 'Stress Testing', 'หาจุดที่ระบบพัง', 'QA'],
    ['Non-Functional', 'Security Testing', 'ทดสอบความปลอดภัย', 'Security QA'],
    ['Non-Functional', 'Usability Testing', 'ทดสอบใช้งานง่าย', 'UX/QA'],
    ['Non-Functional', 'Compatibility Testing', 'ทดสอบใช้ได้บนทุกอุปกรณ์', 'QA'],
]

df_types = pd.DataFrame(testing_types, columns=['ประเภท', 'หัวข้อ', 'คำอธิบาย', 'ผู้รับผิดชอบ'])

# Sheet 3: HTTP Status Codes
http_codes = [
    [200, 'OK', 'สำเร็จ', 'GET, POST, PUT, DELETE'],
    [201, 'Created', 'สร้างสำเร็จ', 'POST'],
    [400, 'Bad Request', 'Request ผิดพลาด', 'ทั้งหมด'],
    [401, 'Unauthorized', 'ไม่ได้ล็อกอิน', 'ทั้งหมด'],
    [403, 'Forbidden', 'ไม่มีสิทธิ์', 'ทั้งหมด'],
    [404, 'Not Found', 'ไม่พบข้อมูล', 'ทั้งหมด'],
    [500, 'Internal Server Error', 'Server มีปัญหา', 'ทั้งหมด'],
    [502, 'Bad Gateway', 'Gateway ผิดพลาด', 'ทั้งหมด'],
    [503, 'Service Unavailable', 'บริการไม่พร้อม', 'ทั้งหมด'],
]

df_http = pd.DataFrame(http_codes, columns=['Code', 'Status', 'ความหมาย', 'ใช้กับ'])

# Sheet 4: OWASP Top 10
owasp = [
    ['A01', 'Broken Access Control', 'Critical', 'เข้าถึงสิ่งที่ไม่ควรเข้าถึงได้'],
    ['A02', 'Cryptographic Failures', 'High', 'การเข้ารหัสผิดพลาด'],
    ['A03', 'Injection', 'Critical', 'SQL Injection, XSS'],
    ['A04', 'Insecure Design', 'High', 'ออกแบบไม่ปลอดภัย'],
    ['A05', 'Security Misconfiguration', 'High', 'ตั้งค่าผิด'],
    ['A06', 'Vulnerable Components', 'Medium', 'ใช้ library ที่มีช่องโหว่'],
    ['A07', 'Auth Failures', 'Critical', 'การยืนยันตัวตนพัง'],
    ['A08', 'Data Integrity Failures', 'High', 'ข้อมูลไม่สมบูรณ์'],
    ['A09', 'Logging Failures', 'Medium', 'ไม่มี log ความปลอดภัย'],
    ['A10', 'SSRF', 'High', 'โจมตี server ผ่าน request'],
]

df_owasp = pd.DataFrame(owasp, columns=['รหัส', 'ชื่อ', 'ระดับความรุนแรง', 'คำอธิบาย'])

# Sheet 5: Test Case Template
test_case_template = [
    ['TC001', 'Login with valid credentials', 'User has account', '1. Open login page\n2. Enter username\n3. Enter password\n4. Click Login', 'Redirect to dashboard', '', 'High'],
    ['TC002', 'Login with invalid password', 'User has account', '1. Open login page\n2. Enter username\n3. Enter wrong password\n4. Click Login', 'Show error message', '', 'High'],
    ['TC003', 'Add to cart', 'Product available', '1. View product\n2. Click Add to Cart\n3. Check cart', 'Product in cart', '', 'Medium'],
]

df_template = pd.DataFrame(test_case_template, columns=['Test Case ID', 'Title', 'Precondition', 'Steps', 'Expected Result', 'Actual Result', 'Priority'])

# Sheet 6: Learning Path
learning_path = [
    [1, 'เริ่มต้น', 'Internet Basics', 'เข้าใจว่าเว็บทำงานยังไง', '3 วัน'],
    [2, 'เริ่มต้น', 'What is Testing?', 'ความหมายของ testing', '2 วัน'],
    [3, 'เริ่มต้น', 'Testing Types', 'รู้จักประเภทการทดสอบ', '3 วัน'],
    [4, 'มือใหม่', 'Test Case Writing', 'เขียน test case เป็น', '1 สัปดาห์'],
    [5, 'มือใหม่', 'Bug Reporting', 'รายงาน bug ได้', '3 วัน'],
    [6, 'มือใหม่', 'Jira + Postman', 'ใช้เครื่องมือพื้นฐาน', '1 สัปดาห์'],
    [7, 'ระดับกลาง', 'Selenium Basics', 'เริ่ม automation', '2 สัปดาห์'],
    [8, 'ระดับกลาง', 'API Testing', 'ทดสอบ API ด้วย Postman', '1 สัปดาห์'],
    [9, 'ระดับสูง', 'Performance Testing', 'JMeter, Load Testing', '2 สัปดาห์'],
    [10, 'ระดับสูง', 'Security Testing', 'OWASP, หาช่องโหว่', '2 สัปดาห์'],
    [11, 'ระดับสูง', 'CI/CD', 'Jenkins, Pipeline', '1 สัปดาห์'],
]

df_path = pd.DataFrame(learning_path, columns=['ลำดับ', 'ระดับ', 'หัวข้อ', 'เป้าหมาย', 'เวลา'])

# Write to Excel
filename = 'QA_Roadmap_From_Roadmapsh.xlsx'
with pd.ExcelWriter(filename, engine='openpyxl') as writer:
    df_main.to_excel(writer, sheet_name='หัวข้อหลัก', index=False)
    df_types.to_excel(writer, sheet_name='Testing Types', index=False)
    df_http.to_excel(writer, sheet_name='HTTP Status Codes', index=False)
    df_owasp.to_excel(writer, sheet_name='OWASP Top 10', index=False)
    df_template.to_excel(writer, sheet_name='Test Case Template', index=False)
    df_path.to_excel(writer, sheet_name='แผนการเรียน', index=False)

print('=' * 60)
print(f'✅ Excel file created: {filename}')
print('=' * 60)
print('\nSheets ทั้งหมด:')
print('  1. หัวข้อหลัก (Main Topics) - 19 หัวข้อ')
print('  2. Testing Types - 12 ประเภทการทดสอบ')
print('  3. HTTP Status Codes - 9 รหัส HTTP')
print('  4. OWASP Top 10 - 10 ช่องโหว่ความปลอดภัย')
print('  5. Test Case Template - ตัวอย่างการเขียน test case')
print('  6. แผนการเรียน (Learning Path) - 11 ขั้นตอน')
print('=' * 60)
