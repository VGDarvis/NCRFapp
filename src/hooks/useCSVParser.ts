import { useState } from 'react';
import Papa from 'papaparse';

export interface CSVParseResult<T> {
  data: T[];
  errors: string[];
  meta: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
}

export function useCSVParser<T>() {
  const [isLoading, setIsLoading] = useState(false);

  const parseCSV = (
    file: File,
    validator?: (row: any) => { isValid: boolean; errors: string[] }
  ): Promise<CSVParseResult<T>> => {
    setIsLoading(true);

    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validData: T[] = [];
          const allErrors: string[] = [];
          let validCount = 0;
          let invalidCount = 0;

          results.data.forEach((row: any, index: number) => {
            if (validator) {
              const validation = validator(row);
              if (validation.isValid) {
                validData.push(row as T);
                validCount++;
              } else {
                invalidCount++;
                validation.errors.forEach((error) => {
                  allErrors.push(`Row ${index + 2}: ${error}`);
                });
              }
            } else {
              validData.push(row as T);
              validCount++;
            }
          });

          setIsLoading(false);
          resolve({
            data: validData,
            errors: allErrors,
            meta: {
              totalRows: results.data.length,
              validRows: validCount,
              invalidRows: invalidCount,
            },
          });
        },
        error: (error) => {
          setIsLoading(false);
          resolve({
            data: [],
            errors: [error.message],
            meta: {
              totalRows: 0,
              validRows: 0,
              invalidRows: 0,
            },
          });
        },
      });
    });
  };

  return { parseCSV, isLoading };
}
