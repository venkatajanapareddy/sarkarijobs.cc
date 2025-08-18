/**
 * Client-side rephrasing utilities for job content
 * Only rephrases paragraphs and descriptive text, NOT job titles or org names
 */

export class RephraseClient {
  /**
   * Rephrase paragraphs for display
   */
  static rephraseParagraph(text: string): string {
    if (!text || text.length < 50) return text;
    
    const replacements: Record<string, string> = {
      'Interested and eligible candidates can attend the interview at the address given below':
        'Eligible candidates should appear for the interview at the venue mentioned below',
      'Interested and eligible candidates': 'Eligible applicants',
      'can attend the interview': 'should appear for the interview',
      'at the address given below': 'at the specified venue',
      'has released the notification for': 'has announced openings for',
      'has officially released': 'has announced',
      'has invited applications': 'is accepting applications',
      'invites applications': 'is seeking applications',
      'To fill up the vacancies': 'To recruit candidates',
      'for the post of': 'for the position of',
      'for the posts of': 'for positions of',
      'Eligible candidates can apply': 'Qualified candidates may apply',
      'Interested candidates': 'Prospective applicants',
      'through online mode': 'via online application',
      'through offline mode': 'via offline application',
      'before applying': 'prior to application',
      'The recruitment is for': 'This recruitment covers',
      'Read the complete notification': 'Review the full announcement',
    };
    
    let rephrased = text;
    for (const [original, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(original, 'gi');
      rephrased = rephrased.replace(regex, replacement);
    }
    
    return rephrased;
  }
  
  /**
   * Rephrase how to apply items
   */
  static rephraseHowToApply(text: string): string {
    if (!text) return text;
    
    const replacements: Record<string, string> = {
      'Visit the official website': 'Check the official portal',
      'Download the application form': 'Obtain the application form',
      'Submit the application': 'Send your application',
      'Fill the application form': 'Complete the application',
      'Pay the application fee': 'Submit the required fee',
      'Upload the documents': 'Attach necessary documents',
      'Take a printout': 'Print a copy',
      'Keep it for future reference': 'Retain for your records',
      'Read the notification carefully': 'Review the official notification thoroughly',
      'Check the eligibility criteria': 'Verify eligibility requirements',
      'Follow the instructions': 'Adhere to the guidelines',
      'Candidates are advised to': 'Applicants should',
      'Candidates must': 'Applicants need to',
    };
    
    let rephrased = text;
    for (const [original, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(original, 'gi');
      rephrased = rephrased.replace(regex, replacement);
    }
    
    return rephrased;
  }
  
  /**
   * Rephrase selection process text
   */
  static rephraseSelectionProcess(text: string): string {
    if (!text) return text;
    
    const replacements: Record<string, string> = {
      'Written Test': 'Written Examination',
      'Written Exam': 'Written Assessment',
      'Personal Interview': 'Face-to-face Interview',
      'Skill Test': 'Practical Assessment',
      'Computer Based Test': 'Online Examination',
      'Document Verification': 'Document Review',
      'Medical Examination': 'Medical Assessment',
      'will be conducted': 'will be held',
      'Candidates will be selected': 'Selection will be made',
      'based on': 'according to',
      'performance in': 'results of'
    };
    
    let rephrased = text;
    for (const [original, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(original, 'gi');
      rephrased = rephrased.replace(regex, replacement);
    }
    
    return rephrased;
  }
}