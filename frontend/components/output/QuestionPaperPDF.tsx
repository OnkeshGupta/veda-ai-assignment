'use client';

import {
  Document, Page, Text, View, StyleSheet,
} from '@react-pdf/renderer';
import type { AssessmentResult, Assignment } from '@/types';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 48,
    paddingRight: 48,
    color: '#181818',
    backgroundColor: '#FFFFFF',
  },

  headerCenter: { textAlign: 'center', marginBottom: 16 },
  schoolName: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  headerSub: { fontSize: 11, marginBottom: 2, color: '#374151' },

  timeMarksRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 6, fontSize: 10, color: '#374151',
  },

  instruction: { fontSize: 10, color: '#374151', marginBottom: 3 },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    marginBottom: 12,
    marginTop: 6,
  },

  studentRow: { flexDirection: 'row', marginBottom: 6, fontSize: 10 },
  studentLabel: { width: 100, color: '#374151' },
  studentLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280',
    borderBottomStyle: 'solid',
  },

  sectionTitle: {
    textAlign: 'center', fontSize: 13,
    fontFamily: 'Helvetica-Bold', marginBottom: 4, marginTop: 14,
  },
  sectionInstr: { fontSize: 9, color: '#6B7280', marginBottom: 8 },

  questionRow: { flexDirection: 'row', marginBottom: 7 },
  qNumber: { width: 20, fontSize: 10, color: '#374151' },
  qBody: { flex: 1, fontSize: 10, color: '#374151', lineHeight: 1.6 },
  qDifficulty: { color: '#6B7280' },
  qMarks: { color: '#6B7280' },

  endOfPaper: {
    fontSize: 10, fontFamily: 'Helvetica-Bold',
    marginTop: 14, marginBottom: 16,
  },

  answerKeyTitle: {
    fontSize: 12, fontFamily: 'Helvetica-Bold',
    marginBottom: 10, marginTop: 8,
  },
  answerRow: { flexDirection: 'row', marginBottom: 7 },
  answerNumber: { width: 20, fontSize: 10, fontFamily: 'Helvetica-Bold' },
  answerText: { flex: 1, fontSize: 10, color: '#374151', lineHeight: 1.6 },
});

interface Props {
  result: AssessmentResult;
  assignment: Assignment;
}

export function QuestionPaperPDF({ result, assignment }: Props) {
  const { paper } = result;

  return (
    <Document
      title={assignment.title}
      author="VedaAI"
      subject={paper.subject}
    >
      <Page size="A4" style={styles.page}>

        <View style={styles.headerCenter}>
          <Text style={styles.schoolName}>{paper.schoolName}</Text>
          <Text style={styles.headerSub}>Subject: {paper.subject}</Text>
          <Text style={styles.headerSub}>Class: {paper.className}</Text>
        </View>

        <View style={styles.timeMarksRow}>
          <Text>Time Allowed: {paper.timeAllowed}</Text>
          <Text>Maximum Marks: {paper.maximumMarks}</Text>
        </View>

        {paper.generalInstructions && paper.generalInstructions.length > 0
          ? paper.generalInstructions.map((inst, i) => (
              <Text key={i} style={styles.instruction}>{inst}</Text>
            ))
          : null}

        <View style={styles.divider} />

        <View style={{ marginBottom: 16 }}>
          {[
            'Name',
            'Roll Number',
            `Class: ${paper.className} Section`,
          ].map((label) => (
            <View key={label} style={styles.studentRow}>
              <Text style={styles.studentLabel}>{label}:</Text>
              <View style={styles.studentLine} />
            </View>
          ))}
        </View>

        {paper.sections.map((section, sIdx) => (
          <View key={sIdx}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionInstr}>{section.instruction}</Text>

            {section.questions.map((q) => (
              <View key={q.number} style={styles.questionRow} wrap={false}>
                <Text style={styles.qNumber}>{q.number}.</Text>
                <Text style={styles.qBody}>
                  <Text style={styles.qDifficulty}>[{q.difficulty}] </Text>
                  {q.text}
                  <Text style={styles.qMarks}> [{q.marks} Marks]</Text>
                </Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.endOfPaper}>End of Question Paper</Text>

        <View style={styles.divider} />

        {paper.answerKey && paper.answerKey.length > 0 ? (
          <View>
            <Text style={styles.answerKeyTitle}>Answer Key:</Text>
            {paper.answerKey.map((a, i) => (
              <View key={i} style={styles.answerRow} wrap={false}>
                <Text style={styles.answerNumber}>{a.questionNumber}.</Text>
                <Text style={styles.answerText}>{a.answer}</Text>
              </View>
            ))}
          </View>
        ) : null}

      </Page>
    </Document>
  );
}