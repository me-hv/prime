"use client";

import * as React from "react";
import { useState } from "react";
import {
  ArtistData,
  ArtistReferenceData,
  DiscoveryStatsData,
  ListeningEntryData,
  StudyFocus,
  StudySessionData,
  AlbumStudyData,
  TodayStudyRecommendation,
} from "@/lib/types";
import { DiscoverHubHeader } from "@/components/discover/DiscoverHubHeader";
import { TodayStudyHero } from "@/components/discover/TodayStudyHero";
import { ReferenceListView } from "@/components/discover/ReferenceListView";
import { ReferenceModal } from "@/components/discover/ReferenceModal";
import { ArtistListView } from "@/components/discover/ArtistListView";
import { ArtistModal } from "@/components/discover/ArtistModal";
import { StudyVaultView } from "@/components/discover/StudyVaultView";
import { StudySessionRunner } from "@/components/discover/StudySessionRunner";
import { AlbumStudyView } from "@/components/discover/AlbumStudyView";
import { ListeningDiaryView } from "@/components/discover/ListeningDiaryView";
import { ListeningEntryModal } from "@/components/discover/ListeningEntryModal";
import { useSearchParams } from "next/navigation";

interface DiscoverHubClientProps {
  initialStats: DiscoveryStatsData;
  initialRecommendation: TodayStudyRecommendation | null;
  initialReferences: ArtistReferenceData[];
  initialArtists: ArtistData[];
  initialStudies: StudySessionData[];
  initialAlbumStudies: AlbumStudyData[];
  initialListening: ListeningEntryData[];
}

export function DiscoverHubClient({
  initialStats,
  initialRecommendation,
  initialReferences,
  initialArtists,
  initialStudies,
  initialAlbumStudies,
  initialListening,
}: DiscoverHubClientProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [references, setReferences] = useState<ArtistReferenceData[]>(initialReferences);
  const [artists, setArtists] = useState<ArtistData[]>(initialArtists);
  const [studies, setStudies] = useState<StudySessionData[]>(initialStudies);
  const [albumStudies, setAlbumStudies] = useState<AlbumStudyData[]>(initialAlbumStudies);
  const [listening, setListening] = useState<ListeningEntryData[]>(initialListening);
  const [stats, setStats] = useState<DiscoveryStatsData>(initialStats);

  // Active Study Mode
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [studyInitialRefId, setStudyInitialRefId] = useState<string | undefined>();
  const [studyInitialFocus, setStudyInitialFocus] = useState<StudyFocus | undefined>();

  // Modals
  const [referenceModalOpen, setReferenceModalOpen] = useState(false);
  const [referenceToEdit, setReferenceToEdit] = useState<ArtistReferenceData | null>(null);

  const [artistModalOpen, setArtistModalOpen] = useState(false);
  const [artistToEdit, setArtistToEdit] = useState<ArtistData | null>(null);

  const [listeningModalOpen, setListeningModalOpen] = useState(false);

  // Handlers
  const handleStartStudy = (refId?: string, focus?: string) => {
    setStudyInitialRefId(refId);
    setStudyInitialFocus(focus as StudyFocus);
    setIsStudyMode(true);
  };

  const handleStudyFinished = (newSession: StudySessionData) => {
    setStudies([newSession, ...studies]);
    setStats((prev) => ({
      ...prev,
      totalStudySessions: prev.totalStudySessions + 1,
      totalStudyMinutes: prev.totalStudyMinutes + Math.round(newSession.durationSeconds / 60),
    }));
    setIsStudyMode(false);
    setActiveTab("vault");
  };

  const handleReferenceSaved = (savedRef: ArtistReferenceData) => {
    setReferences((prev) => {
      const idx = prev.findIndex((r) => r.id === savedRef.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedRef;
        return copy;
      }
      return [savedRef, ...prev];
    });
    setStats((prev) => ({ ...prev, totalReferences: prev.totalReferences + 1 }));
    setReferenceModalOpen(false);
    setReferenceToEdit(null);
  };

  const handleArtistSaved = (savedArtist: ArtistData) => {
    setArtists((prev) => {
      const idx = prev.findIndex((a) => a.id === savedArtist.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedArtist;
        return copy;
      }
      return [savedArtist, ...prev];
    });
    setStats((prev) => ({ ...prev, totalArtistsStudied: prev.totalArtistsStudied + 1 }));
    setArtistModalOpen(false);
    setArtistToEdit(null);
  };

  const handleListeningSaved = (newEntry: ListeningEntryData) => {
    setListening([newEntry, ...listening]);
    setStats((prev) => ({ ...prev, listeningEntriesCount: prev.listeningEntriesCount + 1 }));
    setListeningModalOpen(false);
  };

  const albumReferences = references.filter((r) => r.type === "ALBUM");

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <DiscoverHubHeader
        activeTab={activeTab}
        onTabChange={(t) => {
          setIsStudyMode(false);
          setActiveTab(t);
        }}
        stats={stats}
        onNewReference={() => {
          setReferenceToEdit(null);
          setReferenceModalOpen(true);
        }}
        onNewArtist={() => {
          setArtistToEdit(null);
          setArtistModalOpen(true);
        }}
        onNewListening={() => setListeningModalOpen(true)}
        onStartStudy={() => handleStartStudy()}
      />

      {/* If In Study Mode */}
      {isStudyMode ? (
        <div className="rounded-2xl border border-sky-500/40 bg-prime-surface p-6 shadow-prime-lg">
          <StudySessionRunner
            references={references}
            artists={artists}
            initialReferenceId={studyInitialRefId}
            initialFocus={studyInitialFocus}
            onFinished={handleStudyFinished}
            onCancel={() => setIsStudyMode(false)}
          />
        </div>
      ) : (
        <>
          {/* 1. Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Today's Recommended Study Hero */}
              {initialRecommendation && (
                <TodayStudyHero
                  recommendation={initialRecommendation}
                  onStartStudy={(refId, focus) => handleStartStudy(refId, focus)}
                />
              )}

              {/* Grid: Recent Studies Stream & Reference Library Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-prime-text">
                      Recent Track Anatomy Dissections
                    </h3>
                    <button
                      onClick={() => setActiveTab("vault")}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      View All ({studies.length})
                    </button>
                  </div>
                  <StudyVaultView
                    studies={studies.slice(0, 4)}
                    onStartStudy={() => handleStartStudy()}
                    onDeleted={(id) => setStudies(studies.filter((s) => s.id !== id))}
                  />
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-prime-text">
                      Reference Vault Preview
                    </h3>
                    <button
                      onClick={() => setActiveTab("references")}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      Browse All ({references.length})
                    </button>
                  </div>
                  <ReferenceListView
                    references={references.slice(0, 4)}
                    onNewReference={() => {
                      setReferenceToEdit(null);
                      setReferenceModalOpen(true);
                    }}
                    onEditReference={(ref) => {
                      setReferenceToEdit(ref);
                      setReferenceModalOpen(true);
                    }}
                    onStudyReference={(ref) => handleStartStudy(ref.id)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Study Vault Tab */}
          {activeTab === "vault" && (
            <StudyVaultView
              studies={studies}
              onStartStudy={() => handleStartStudy()}
              onDeleted={(id) => setStudies(studies.filter((s) => s.id !== id))}
            />
          )}

          {/* 3. Album Studies Tab */}
          {activeTab === "albums" && (
            <AlbumStudyView
              studies={albumStudies}
              albumReferences={albumReferences}
              onStudySaved={(newStudy) => setAlbumStudies([newStudy, ...albumStudies])}
              onDeleted={(id) =>
                setAlbumStudies(albumStudies.filter((s) => s.id !== id))
              }
            />
          )}

          {/* 4. Reference Library Tab */}
          {activeTab === "references" && (
            <ReferenceListView
              references={references}
              onNewReference={() => {
                setReferenceToEdit(null);
                setReferenceModalOpen(true);
              }}
              onEditReference={(ref) => {
                setReferenceToEdit(ref);
                setReferenceModalOpen(true);
              }}
              onStudyReference={(ref) => handleStartStudy(ref.id)}
            />
          )}

          {/* 5. Artist Library Tab */}
          {activeTab === "artists" && (
            <ArtistListView
              artists={artists}
              onNewArtist={() => {
                setArtistToEdit(null);
                setArtistModalOpen(true);
              }}
              onEditArtist={(artist) => {
                setArtistToEdit(artist);
                setArtistModalOpen(true);
              }}
              onAddReferenceForArtist={(artist) => {
                setReferenceToEdit({
                  id: "",
                  userId: "",
                  type: "SONG",
                  title: "",
                  creator: artist.name,
                  artistId: artist.id,
                  year: null,
                  url: null,
                  album: null,
                  genre: artist.genres?.split(",")[0] || null,
                  notes: null,
                  tags: null,
                  favorite: false,
                  createdAt: "",
                  updatedAt: "",
                });
                setReferenceModalOpen(true);
              }}
              onFilterByArtist={() => {
                setActiveTab("references");
              }}
            />
          )}

          {/* 6. Listening Diary Tab */}
          {activeTab === "listening" && (
            <ListeningDiaryView
              entries={listening}
              references={references}
              onStudyTrack={(title) => {
                const found = references.find((r) => r.title === title);
                handleStartStudy(found?.id);
              }}
              onEntrySaved={handleListeningSaved}
              onDeleted={(id) => setListening(listening.filter((e) => e.id !== id))}
            />
          )}
        </>
      )}

      {/* Modals */}
      {referenceModalOpen && (
        <ReferenceModal
          isOpen={referenceModalOpen}
          onClose={() => {
            setReferenceModalOpen(false);
            setReferenceToEdit(null);
          }}
          referenceToEdit={referenceToEdit}
          artists={artists}
          onSaved={handleReferenceSaved}
        />
      )}

      {artistModalOpen && (
        <ArtistModal
          isOpen={artistModalOpen}
          onClose={() => {
            setArtistModalOpen(false);
            setArtistToEdit(null);
          }}
          artistToEdit={artistToEdit}
          onSaved={handleArtistSaved}
        />
      )}

      {listeningModalOpen && (
        <ListeningEntryModal
          isOpen={listeningModalOpen}
          onClose={() => setListeningModalOpen(false)}
          references={references}
          onSaved={handleListeningSaved}
        />
      )}
    </div>
  );
}
