import json
import os
from datetime import datetime

# Ensure the output_reports directory exists
output_reports_dir = 'reports_output'
os.makedirs(output_reports_dir, exist_ok=True)

# Get the first JSON file in the output_reports directory (assuming there is only one JSON file)
json_files = [f for f in os.listdir(output_reports_dir) if f.endswith('.json')]

if json_files:
    # Load the output result from the first JSON file found
    json_file_path = os.path.join(output_reports_dir, json_files[0])
    with open(json_file_path, 'r') as file:
        report_data = json.load(file)

    # Initialize report content
    report = f"Security Report for {report_data['target']}\n"
    report += f"Timestamp: {report_data['timestamp']}\n\n"
    report += "Vulnerabilities Detected:\n"

    # Iterate over vulnerabilities and categorize them
    for vuln in report_data['vulnerabilities']:
        if vuln['vulnerable']:
            # Extract data for each vulnerability
            url = vuln['vector']['url']
            payload = vuln['vector']['payload']
            status_code = vuln['vector']['status_code']
            body = vuln['vector']['body']

            # Generate the readable report content for each vulnerability
            if "OR '1'='1" in payload:
                report += f"\nSQL Injection (SQLi) Vulnerability\n"
                report += f"URL: {url}\n"
                report += f"Payload: {payload}\n"
                report += f"Status Code: {status_code}\n"
                report += f"Response: {body}\n"
                report += f"Impact: This vulnerability allows attackers to inject malicious SQL queries. Potential unauthorized database access or manipulation.\n"
                report += f"Recommendations: Implement input sanitization and use parameterized queries to prevent SQL injection.\n"
            
            elif "<script>" in payload:
                report += f"\nCross-Site Scripting (XSS) Vulnerability\n"
                report += f"URL: {url}\n"
                report += f"Payload: {payload}\n"
                report += f"Status Code: {status_code}\n"
                report += f"Response: {body}\n"
                report += f"Impact: Reflected XSS allows attackers to execute JavaScript code in the user's browser.\n"
                report += f"Recommendations: Sanitize user inputs, validate inputs and output encoding to prevent XSS.\n"

            elif "' UNION SELECT NULL--" in payload:
                report += f"\nSQL Injection (SQLi) with UNION SELECT Vulnerability\n"
                report += f"URL: {url}\n"
                report += f"Payload: {payload}\n"
                report += f"Status Code: {status_code}\n"
                report += f"Response: {body}\n"
                report += f"Impact: UNION-based SQL injection could allow attackers to retrieve data from the database.\n"
                report += f"Recommendations: Use prepared statements for database queries to prevent UNION-based injections.\n"

            elif "../../../../etc/passwd" in payload:
                report += f"\nLocal File Inclusion (LFI) / Path Traversal Vulnerability\n"
                report += f"URL: {url}\n"
                report += f"Payload: {payload}\n"
                report += f"Status Code: {status_code}\n"
                report += f"Response: {body}\n"
                report += f"Impact: Path traversal allows attackers to access sensitive files like /etc/passwd on Linux systems.\n"
                report += f"Recommendations: Implement input validation, sanitize file paths, and use whitelisting.\n"

    # Ensure the reports_output directory exists
    reports_output_dir = 'reports_output'
    os.makedirs(reports_output_dir, exist_ok=True)

    # Generate a filename based on the current timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"{reports_output_dir}/security_report_{timestamp}.txt"

    # Write the report to the file
    with open(file_name, 'w') as f:
        f.write(report)

    print(f"Report saved to {file_name}")

    # Delete the JSON file after processing
    os.remove(json_file_path)
    print(f"Deleted the JSON file: {json_file_path}")
else:
    print("No JSON files found in the output_reports directory.")

