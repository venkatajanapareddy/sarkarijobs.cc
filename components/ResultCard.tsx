'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download, ExternalLink, Building2, FileText, Trophy, Clock } from 'lucide-react';

interface ExamResult {
  id: string;
  examName: string;
  organization: string;
  resultType: string;
  status: string;
  category: string;
  dates: {
    declared?: string;
    exam?: string;
  };
  links: {
    resultPage: string;
    downloadPDF?: string;
    officialWebsite?: string;
    answerKey?: string;
  };
  metadata: {
    originalTitle: string;
    url: string;
  };
}

interface ResultCardProps {
  result: ExamResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'declared':
        return 'border-l-green-500';
      case 'awaited':
        return 'border-l-orange-500';
      case 'provisional':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      medical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      engineering: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      civil_services: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      banking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      ssc: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      railway: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      teaching: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800',
      police: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      defence: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
      other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    };
    return colors[category] || colors.other;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const isNew = () => {
    if (!result.dates?.declared) return false;
    const declaredDate = new Date(result.dates.declared);
    const daysSince = (Date.now() - declaredDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 3;
  };

  const getResultTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      entrance_exam: 'Entrance',
      recruitment: 'Recruitment',
      merit_list: 'Merit List',
      wait_list: 'Wait List',
      answer_key: 'Answer Key',
      admit_card: 'Admit Card',
      scorecard: 'Scorecard',
      seat_allotment: 'Allotment',
      result: 'Result',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-4 h-full flex flex-col">
      {/* Header Row - fixed height */}
      <div className="flex items-start justify-between gap-2 min-h-[3rem]">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
            {result.organization}
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5 line-clamp-1">
            {result.examName}
          </p>
        </div>
        {isNew() && (
          <span className="flex-shrink-0 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs px-2 py-1 rounded-full font-medium">
            New
          </span>
        )}
      </div>

      {/* Info Row - fixed height */}
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400 min-h-[1.25rem]">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {getResultTypeLabel(result.resultType)}
        </span>
        <span className="flex items-center gap-1">
          <Trophy className="w-3 h-3" />
          {result.category.replace('_', ' ')}
        </span>
        {result.status === 'declared' && (
          <span className="text-green-600 dark:text-green-400 font-medium">
            Declared
          </span>
        )}
      </div>

      {/* Spacer to push date row to bottom */}
      <div className="flex-grow"></div>

      {/* Date Row - always at bottom */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {result.dates?.declared ? `Result: ${formatDate(result.dates.declared)}` : 
           result.dates?.exam ? `Exam: ${formatDate(result.dates.exam)}` : 
           'Date not available'}
        </span>
        {result.links?.downloadPDF ? (
          <Button
            size="sm"
            className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(result.links?.downloadPDF, '_blank');
            }}
          >
            <Download className="w-3 h-3 mr-1" />
            PDF
          </Button>
        ) : (
          <ExternalLink className="w-4 h-4 text-gray-400" />
        )}
      </div>
    </div>
  );
}