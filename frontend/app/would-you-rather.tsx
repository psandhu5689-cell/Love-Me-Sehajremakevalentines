import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from './_layout';
import { useTheme } from '../src/theme/ThemeContext';
import { ThemedBackground, ThemedCard } from '../src/components/themed';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Question {
  optionA: string;
  optionB: string;
}

interface Response {
  id: string;
  question: Question;
  choice: 'A' | 'B';
  reason?: string;
  date: string;
}

const QUESTIONS: Question[] = [
  { optionA: "Cuddle all night", optionB: "Kiss all day" },
  { optionA: "Movie night", optionB: "Late night drive" },
  { optionA: "Hold hands forever", optionB: "Hugs forever" },
  { optionA: "Soft kisses", optionB: "Forehead kisses" },
  { optionA: "Stay in together", optionB: "Go on a date" },
  { optionA: "Be little spoon", optionB: "Be big spoon" },
  { optionA: "Love notes", optionB: "Surprise gifts" },
  { optionA: "Beach trip", optionB: "City trip" },
  { optionA: "Matching outfits", optionB: "Matching tattoos" },
  { optionA: "Call all night", optionB: "Text all day" },
  { optionA: "Lazy day together", optionB: "Adventure day" },
  { optionA: "Compliments", optionB: "Physical affection" },
  { optionA: "Slow dancing", optionB: "Car singing" },
  { optionA: "Cute pics together", optionB: "Silly pics together" },
  { optionA: "Late night talks", optionB: "Morning cuddles" },
  { optionA: "Be kissed randomly", optionB: "Be hugged randomly" },
  { optionA: "Sweet messages", optionB: "Voice notes" },
  { optionA: "Stay up late together", optionB: "Wake up early together" },
  { optionA: "Pillow talk", optionB: "Deep talks" },
  { optionA: "Soft love", optionB: "Passionate love" },
  { optionA: "Breakfast in bed", optionB: "Dinner date" },
  { optionA: "Watch sunrise together", optionB: "Watch sunset together" },
  { optionA: "Cook together", optionB: "Order takeout together" },
  { optionA: "Road trip", optionB: "Staycation" },
  { optionA: "First kiss again", optionB: "First date again" },
  { optionA: "Write love letters", optionB: "Make playlists for each other" },
  { optionA: "Dance in the rain", optionB: "Dance in the kitchen" },
  { optionA: "Picnic in the park", optionB: "Rooftop dinner" },
  { optionA: "Build a fort together", optionB: "Stargaze together" },
  { optionA: "Morning texts", optionB: "Goodnight calls" },
];

export default function WouldYouRather() {
  const router = useRouter();
  const { playClick, playSuccess, playMagic } = useAudio();
  const { colors, isDark } = useTheme();

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [choice, setChoice] = useState<'A' | 'B' | null>(null);
  const [reason, setReason] = useState('');
  const [responses, setResponses] = useState<Response[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(1)).current;
  const choiceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadResponses();
    getNextQuestion();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadResponses = async () => {
    try {
      const saved = await AsyncStorage.getItem('would_you_rather_responses');
      if (saved) setResponses(JSON.parse(saved));
    } catch (error) {
      console.log('Error loading responses:', error);
    }
  };

  const getNextQuestion = () => {
    setChoice(null);
    setReason('');
    choiceAnim.setValue(0);

    let availableIndices = QUESTIONS.map((_, i) => i).filter(i => !usedIndices.includes(i));

    if (availableIndices.length === 0) {
      setUsedIndices([]);
      availableIndices = QUESTIONS.map((_, i) => i);
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setCurrentQuestion(QUESTIONS[randomIndex]);
    setUsedIndices(prev => [...prev, randomIndex]);

    Animated.sequence([
      Animated.timing(cardAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.spring(cardAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const handleChoice = async (selected: 'A' | 'B') => {
    playMagic();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setChoice(selected);

    Animated.timing(choiceAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const saveAndNext = async () => {
    if (!currentQuestion || !choice) return;

    playSuccess();

    const newResponse: Response = {
      id: Date.now().toString(),
      question: currentQuestion,
      choice,
      reason: reason.trim() || undefined,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    const updated = [newResponse, ...responses];
    setResponses(updated);

    try {
      await AsyncStorage.setItem('would_you_rather_responses', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving:', error);
    }

    getNextQuestion();
  };

  const skipQuestion = () => {
    playClick();
    getNextQuestion();
  };

  if (showHistory) {
    return (
      <ThemedBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => { playClick(); setShowHistory(false); }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Past Choices 📝</Text>

            <View style={{ width: 44 }} />
          </View>

          <ScrollView contentContainerStyle={styles.historyContent}>
            {responses.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="help-circle-outline" size={60} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No choices yet!</Text>
                <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Play the game to see your history</Text>
              </View>
            ) : (
              responses.map((response) => (
                <ThemedCard key={response.id} variant="glass" style={styles.historyCard}>
                  <Text style={[styles.historyDate, { color: colors.textMuted }]}>{response.date}</Text>
                  <Text style={[styles.historyQuestion, { color: colors.textPrimary }]}>
                    {response.question.optionA} vs {response.question.optionB}
                  </Text>
                  <View style={styles.historyChoiceContainer}>
                    <Ionicons name="heart" size={16} color={colors.primary} />
                    <Text style={[styles.historyChoice, { color: colors.primary }]}>
                      {response.choice === 'A' ? response.question.optionA : response.question.optionB}
                    </Text>
                  </View>
                  {response.reason && (
                    <Text style={[styles.historyReason, { color: colors.textSecondary }]}>"{response.reason}"</Text>
                  )}
                </ThemedCard>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground showFloatingElements={true}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => { playClick(); router.back(); }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Would You Rather 🎲</Text>

          <TouchableOpacity
            style={[styles.historyButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => { playClick(); setShowHistory(true); }}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={24} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.gameContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Question Card */}
            <Animated.View style={{ transform: [{ scale: cardAnim }] }}>
              <ThemedCard variant="glow" glowColor={colors.secondary} style={styles.questionCard}>
                <Text style={[styles.wouldYouRather, { color: colors.secondary }]}>Would you rather...</Text>

                {currentQuestion && (
                  <>
                    {/* Option A */}
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        { backgroundColor: colors.secondaryGlow, borderColor: colors.secondary },
                        choice === 'A' && [styles.optionSelected, { backgroundColor: colors.secondary }],
                        choice === 'B' && styles.optionNotSelected,
                      ]}
                      onPress={() => handleChoice('A')}
                      disabled={choice !== null}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: colors.textPrimary },
                        choice === 'A' && styles.optionTextSelected,
                      ]}>
                        {currentQuestion.optionA}
                      </Text>
                      {choice === 'A' && (
                        <Ionicons name="heart" size={24} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>

                    <Text style={[styles.orText, { color: colors.textSecondary }]}>OR</Text>

                    {/* Option B */}
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        { backgroundColor: colors.secondaryGlow, borderColor: colors.secondary },
                        choice === 'B' && [styles.optionSelected, { backgroundColor: colors.secondary }],
                        choice === 'A' && styles.optionNotSelected,
                      ]}
                      onPress={() => handleChoice('B')}
                      disabled={choice !== null}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: colors.textPrimary },
                        choice === 'B' && styles.optionTextSelected,
                      ]}>
                        {currentQuestion.optionB}
                      </Text>
                      {choice === 'B' && (
                        <Ionicons name="heart" size={24} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </ThemedCard>
            </Animated.View>

            {/* Choice Made Section */}
            {choice && (
              <Animated.View style={[styles.choiceMadeSection, { opacity: choiceAnim }]}>
                <View style={styles.choiceConfirmation}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  <Text style={[styles.youChose, { color: colors.success }]}>
                    You chose: {choice === 'A' ? currentQuestion?.optionA : currentQuestion?.optionB}
                  </Text>
                </View>

                {/* Why Input */}
                <View style={styles.whySection}>
                  <Text style={[styles.whyLabel, { color: colors.textSecondary }]}>Why? (optional)</Text>
                  <ThemedCard variant="glass" style={styles.whyInputCard}>
                    <TextInput
                      style={[styles.whyInput, { color: colors.textPrimary }]}
                      placeholder="Tell me why..."
                      placeholderTextColor={colors.textMuted}
                      value={reason}
                      onChangeText={setReason}
                      multiline
                    />
                  </ThemedCard>
                </View>

                {/* Next Button */}
                <TouchableOpacity
                  style={[styles.nextButton, { backgroundColor: colors.secondary, shadowColor: colors.secondary }]}
                  onPress={saveAndNext}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextButtonText}>Next Question</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Skip Button */}
            {!choice && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={skipQuestion}
                activeOpacity={0.8}
              >
                <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip this one</Text>
                <Ionicons name="refresh" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}

            {/* Progress */}
            <View style={styles.progressContainer}>
              <Text style={[styles.progressText, { color: colors.textMuted }]}>
                {responses.length} questions answered • {QUESTIONS.length - usedIndices.length} left in round
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  historyButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  gameContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  questionCard: {
    width: '100%',
  },
  wouldYouRather: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  optionSelected: {
    borderWidth: 2,
  },
  optionNotSelected: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  orText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
  },
  choiceMadeSection: {
    width: '100%',
    marginTop: 24,
  },
  choiceConfirmation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  youChose: {
    fontSize: 16,
    fontWeight: '600',
  },
  whySection: {
    marginBottom: 20,
  },
  whyLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  whyInputCard: {
    padding: 0,
  },
  whyInput: {
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    gap: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
  },
  // History Styles
  historyContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  historyCard: {
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  historyQuestion: {
    fontSize: 14,
    marginBottom: 8,
  },
  historyChoiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyChoice: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyReason: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
