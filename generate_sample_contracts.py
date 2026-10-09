import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

def create_sample_nda(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=12
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#475569'),
        spaceAfter=20
    )

    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=14,
        alignment=TA_JUSTIFY,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    meta_style = ParagraphStyle(
        'Meta',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    story.append(Paragraph("MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT", title_style))
    story.append(Paragraph("Standard Commercial Form &middot; Document Ref: NDA-2026-0801", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceAfter=15))

    # Parties Summary Table
    meta_data = [
        [
            Paragraph("<b>Effective Date:</b> August 1, 2026", meta_style),
            Paragraph("<b>Jurisdiction:</b> State of Delaware, USA", meta_style)
        ],
        [
            Paragraph("<b>Disclosing Party:</b> Aether AI Technologies Inc.", meta_style),
            Paragraph("<b>Receiving Party:</b> Zenith Enterprises LLC", meta_style)
        ]
    ]
    t = Table(meta_data, colWidths=[250, 250])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t)
    story.append(Spacer(1, 15))

    story.append(Paragraph(
        "This Mutual Non-Disclosure Agreement (\"Agreement\") is entered into as of the Effective Date written above, by and between <b>Aether AI Technologies Inc.</b>, a Delaware corporation, having its principal place of business at 100 Tech Boulevard, Suite 400, Wilmington, DE (\"Party A\"), and <b>Zenith Enterprises LLC</b>, a California limited liability company, having its principal place of business at 500 Market Street, San Francisco, CA (\"Party B\"). Party A and Party B are collectively referred to as the \"Parties\" and individually as a \"Party\".",
        body_style
    ))

    story.append(Paragraph("1. Purpose &amp; Confidential Information", heading_style))
    story.append(Paragraph(
        "The Parties wish to explore potential business collaboration and technical integration opportunities (the \"Purpose\"). In connection with the Purpose, each Party may disclose to the other Party certain technical, financial, or business information. \"Confidential Information\" means all information disclosed by one Party (\"Disclosing Party\") to the other Party (\"Receiving Party\"), whether orally, in writing, electronically, or by inspection of tangible objects, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.",
        body_style
    ))

    story.append(Paragraph("2. Exclusions from Confidentiality", heading_style))
    story.append(Paragraph(
        "Confidential Information does not include information that: (a) is or becomes publicly known through no breach of this Agreement by the Receiving Party; (b) was already known to the Receiving Party prior to disclosure without confidentiality restrictions; (c) is independently developed by the Receiving Party without reference to or use of the Disclosing Party's Confidential Information; or (d) is rightfully obtained from a third party without an obligation of confidentiality.",
        body_style
    ))

    story.append(Paragraph("3. Non-Disclosure &amp; Standard of Care", heading_style))
    story.append(Paragraph(
        "The Receiving Party agrees to protect the Disclosing Party's Confidential Information with the same degree of care it uses for its own confidential information of like nature, but no less than reasonable care. The Receiving Party shall not disclose Confidential Information to any third party, except to its employees, officers, and legal advisors who need to know such information for the Purpose and who are bound by confidentiality obligations at least as restrictive as those herein.",
        body_style
    ))

    story.append(Paragraph("4. Term &amp; Termination", heading_style))
    story.append(Paragraph(
        "This Agreement shall remain in effect for a period of three (3) years from the Effective Date, unless terminated earlier by either Party upon thirty (30) days prior written notice. The obligations of confidentiality and non-use with respect to Confidential Information disclosed prior to termination shall survive termination for a period of five (5) years.",
        body_style
    ))

    story.append(Paragraph("5. Payment &amp; Consideration", heading_style))
    story.append(Paragraph(
        "The Parties acknowledge that no financial exchange or licensing fee is contemplated or required under this Agreement. Each Party shall bear its own costs and expenses incurred in evaluating the Purpose. Standard reciprocal terms apply without penalty fees or billing requirements.",
        body_style
    ))

    story.append(Paragraph("6. Return or Destruction of Materials", heading_style))
    story.append(Paragraph(
        "Upon written request of the Disclosing Party or upon expiration/termination of this Agreement, the Receiving Party shall promptly return or certify the destruction of all documents, notes, prototypes, and computer files containing Confidential Information within thirty (30) business days, retaining only archival backups as mandated by applicable regulatory compliance requirements.",
        body_style
    ))

    story.append(Paragraph("7. Limitation of Liability &amp; Remedies", heading_style))
    story.append(Paragraph(
        "Except for breaches of Section 3 (Non-Disclosure) and willful misconduct, neither Party shall be liable for indirect, special, incidental, or consequential damages arising out of this Agreement. Aggregate liability under this Agreement shall not exceed fifty thousand dollars ($50,000 USD). The Receiving Party acknowledges that unauthorized disclosure would cause irreparable harm for which monetary damages alone would be inadequate, and the Disclosing Party shall be entitled to seek injunctive relief in any court of competent jurisdiction.",
        body_style
    ))

    story.append(Paragraph("8. Governing Law &amp; Dispute Resolution", heading_style))
    story.append(Paragraph(
        "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles. Any dispute, claim, or controversy arising out of this Agreement shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) in Wilmington, Delaware.",
        body_style
    ))

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceAfter=15))

    # Signatures Table
    sig_data = [
        [
            Paragraph("<b>FOR AETHER AI TECHNOLOGIES INC.:</b>", meta_style),
            Paragraph("<b>FOR ZENITH ENTERPRISES LLC:</b>", meta_style)
        ],
        [
            Paragraph("<br/><br/>Signature: __________________________<br/>Name: Elena Vance, Chief Legal Officer<br/>Date: August 1, 2026", meta_style),
            Paragraph("<br/><br/>Signature: __________________________<br/>Name: Marcus Sterling, Managing Director<br/>Date: August 1, 2026", meta_style)
        ]
    ]
    st = Table(sig_data, colWidths=[250, 250])
    st.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(st)

    doc.build(story)
    print(f"Successfully generated NDA PDF: {output_path}")

def create_sample_msa(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=12
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#475569'),
        spaceAfter=20
    )

    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=14,
        alignment=TA_JUSTIFY,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    meta_style = ParagraphStyle(
        'Meta',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    story.append(Paragraph("MASTER SOFTWARE SERVICES &amp; CONSULTING AGREEMENT", title_style))
    story.append(Paragraph("Commercial Professional Services Agreement &middot; MSA-2026-ENG", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceAfter=15))

    meta_data = [
        [
            Paragraph("<b>Effective Date:</b> September 15, 2026", meta_style),
            Paragraph("<b>Contract Type:</b> Master Services Agreement", meta_style)
        ],
        [
            Paragraph("<b>Service Provider:</b> Nexus Cloud Solutions Ltd.", meta_style),
            Paragraph("<b>Client:</b> Horizon Financial Group Inc.", meta_style)
        ]
    ]
    t = Table(meta_data, colWidths=[250, 250])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t)
    story.append(Spacer(1, 15))

    story.append(Paragraph(
        "This Master Services Agreement (\"Agreement\") is entered into as of September 15, 2026, by and between <b>Nexus Cloud Solutions Ltd.</b>, a Delaware corporation (\"Provider\"), and <b>Horizon Financial Group Inc.</b>, a New York corporation (\"Client\").",
        body_style
    ))

    story.append(Paragraph("Section 1: Scope of Services &amp; Deliverables", heading_style))
    story.append(Paragraph(
        "Provider agrees to perform professional cloud migration, software engineering, and security review services as detailed in Statements of Work (\"SOW\") executed hereunder. All work shall be performed in a professional, workmanlike manner adhering to industry quality standards.",
        body_style
    ))

    story.append(Paragraph("Section 2: Payment Terms &amp; Invoicing", heading_style))
    story.append(Paragraph(
        "Client shall remit payment for undisputed invoices within thirty (30) days of receipt (Net 30). Late payments shall accrue interest at the rate of one and a half percent (1.5%) per month or the maximum statutory rate permitted by law, whichever is lower. Client shall notify Provider in writing of any disputed amounts within fifteen (15) days of invoice date.",
        body_style
    ))

    story.append(Paragraph("Section 3: Term &amp; Early Termination", heading_style))
    story.append(Paragraph(
        "The initial term of this Agreement shall be twelve (12) months. Either party may terminate this Agreement without cause upon sixty (60) days prior written notice. Either party may terminate immediately for material breach if such breach remains uncured for thirty (30) days following written notice.",
        body_style
    ))

    story.append(Paragraph("Section 4: Limitation of Liability &amp; Indemnification", heading_style))
    story.append(Paragraph(
        "Except for gross negligence, willful misconduct, or breach of confidentiality obligations, each party's aggregate cumulative liability arising out of or related to this Agreement shall be capped at the total fees paid or payable by Client to Provider under the applicable SOW in the preceding twelve (12) months.",
        body_style
    ))

    story.append(Paragraph("Section 5: Governing Law &amp; Jurisdiction", heading_style))
    story.append(Paragraph(
        "This Agreement shall be construed and enforced under the laws of the State of New York. The parties agree to the exclusive jurisdiction of the state and federal courts located in New York County, New York.",
        body_style
    ))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceAfter=15))

    sig_data = [
        [
            Paragraph("<b>NEXUS CLOUD SOLUTIONS LTD.</b>", meta_style),
            Paragraph("<b>HORIZON FINANCIAL GROUP INC.</b>", meta_style)
        ],
        [
            Paragraph("<br/><br/>Authorized Signature: __________________<br/>Title: VP of Engineering<br/>Date: September 15, 2026", meta_style),
            Paragraph("<br/><br/>Authorized Signature: __________________<br/>Title: Chief Operations Officer<br/>Date: September 15, 2026", meta_style)
        ]
    ]
    st = Table(sig_data, colWidths=[250, 250])
    st.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(st)

    doc.build(story)
    print(f"Successfully generated MSA PDF: {output_path}")

if __name__ == '__main__':
    targets = [
        r"c:\Users\veeno\OneDrive\Desktop\Sample_Mutual_NDA.pdf",
        r"c:\Users\veeno\OneDrive\Desktop\contract_review_assist-main\Sample_Mutual_NDA.pdf",
        r"c:\Users\veeno\OneDrive\Desktop\Sample_Master_Services_Agreement.pdf",
        r"c:\Users\veeno\OneDrive\Desktop\contract_review_assist-main\Sample_Master_Services_Agreement.pdf",
    ]
    os.makedirs(r"c:\Users\veeno\OneDrive\Desktop\contract_review_assist-main\client\public", exist_ok=True)
    targets.append(r"c:\Users\veeno\OneDrive\Desktop\contract_review_assist-main\client\public\Sample_Mutual_NDA.pdf")
    targets.append(r"c:\Users\veeno\OneDrive\Desktop\contract_review_assist-main\client\public\Sample_Master_Services_Agreement.pdf")

    for path in [targets[0], targets[1], targets[4]]:
        create_sample_nda(path)

    for path in [targets[2], targets[3], targets[5]]:
        create_sample_msa(path)
