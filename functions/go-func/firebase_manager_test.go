package forester

import (
	adifpb "github.com/k0swe/adif-json-protobuf/go"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
	"testing"
	"time"
)

func Test_mergeQso(t *testing.T) {
	type args struct {
		base     *adifpb.Qso
		backfill *adifpb.Qso
	}
	type returnValues struct {
		diff    bool
		wantQso *adifpb.Qso
	}
	tests := []struct {
		name string
		args args
		want returnValues
	}{
		{
			name: "Simple",
			args: args{
				base:     &adifpb.Qso{Band: "20m", Freq: 14.050},
				backfill: &adifpb.Qso{Band: "20m", Mode: "CW"},
			},
			want: returnValues{
				diff:    true,
				wantQso: &adifpb.Qso{Band: "20m", Freq: 14.050, Mode: "CW"},
			},
		},
		{
			name: "Simple no diff",
			args: args{
				base: &adifpb.Qso{Band: "20m", Freq: 14.050, Mode: "CW"},
				// Backfill freq is different, but it isn't used
				backfill: &adifpb.Qso{Band: "20m", Freq: 14.051},
			},
			want: returnValues{
				diff:    false,
				wantQso: &adifpb.Qso{Band: "20m", Freq: 14.050, Mode: "CW"},
			},
		},
		{
			name: "WsjtxPlusQrzcom",
			args: args{
				base: &adifpb.Qso{
					Band: "40m",
					Freq: 7.07595,
					Mode: "FT8",
					ContactedStation: &adifpb.Station{
						StationCall: "K9IJ",
						GridSquare:  "EN52",
						OpName:      "Johnny",
					},
				},
				backfill: &adifpb.Qso{
					Band: "40m",
					Freq: 7.07595,
					Mode: "FT8",
					ContactedStation: &adifpb.Station{
						StationCall: "K9IJ",
						GridSquare:  "EN52",
						OpName:      "JOHN F RICE",
						City:        "LAKE ZURICH",
						State:       "IL",
						Country:     "United States",
						Dxcc:        291,
					},
				},
			},
			want: returnValues{
				diff: true,
				wantQso: &adifpb.Qso{
					Band: "40m",
					Freq: 7.07595,
					Mode: "FT8",
					ContactedStation: &adifpb.Station{
						StationCall: "K9IJ",
						GridSquare:  "EN52",
						OpName:      "Johnny",
						City:        "LAKE ZURICH",
						State:       "IL",
						Country:     "United States",
						Dxcc:        291,
					},
				},
			},
		},
		{
			name: "QrzcomPlusQrzcom",
			args: args{
				base: &adifpb.Qso{
					Band: "40m",
					Freq: 7.07595,
					Mode: "FT8",
					ContactedStation: &adifpb.Station{
						StationCall: "K9IJ",
						GridSquare:  "EN52",
						OpName:      "JOHN F RICE",
						City:        "LAKE ZURICH",
						State:       "IL",
						Country:     "United States",
						Dxcc:        291,
					},
				},
				backfill: &adifpb.Qso{
					Band: "40m",
					Freq: 7.07595,
					Mode: "FT8",
					ContactedStation: &adifpb.Station{
						StationCall: "K9IJ",
						GridSquare:  "EN52",
						OpName:      "JOHN F RICE",
						City:        "LAKE ZURICH",
						State:       "IL",
						Country:     "United States",
						Dxcc:        291,
					},
				},
			},
			want: returnValues{
				diff: false,
				wantQso: &adifpb.Qso{
					Band: "40m",
					Freq: 7.07595,
					Mode: "FT8",
					ContactedStation: &adifpb.Station{
						StationCall: "K9IJ",
						GridSquare:  "EN52",
						OpName:      "JOHN F RICE",
						City:        "LAKE ZURICH",
						State:       "IL",
						Country:     "United States",
						Dxcc:        291,
					},
				},
			},
		},
		{
			name: "QrzcomPlusLotw",
			args: args{
				base: &adifpb.Qso{
					LoggingStation: &adifpb.Station{
						OpName:      "Christopher C Keller",
						GridSquare:  "DM79LV",
						Latitude:    39.9103,
						Longitude:   -105.0569,
						Power:       50,
						StationCall: "K0SWE",
						City:        "Westminster",
						County:      "CO, Jefferson",
						State:       "CO",
						Country:     "United States",
						CqZone:      4,
						ItuZone:     7,
					},
					ContactedStation: &adifpb.Station{
						OpName:      "Paul M St John",
						GridSquare:  "CN94",
						Latitude:    33.8777,
						Longitude:   -117.7056,
						StationCall: "N6DN",
						City:        "Yorba Linda",
						County:      "CA, Orange",
						State:       "CA",
						Country:     "United States",
						Dxcc:        291,
						Continent:   "NA",
						Email:       "N6DN@ix.netcom.com",
					},
					Propagation: &adifpb.Propagation{},
					Band:        "20m",
					BandRx:      "20m",
					Freq:        14.0761,
					FreqRx:      14.0761,
					Mode:        "FT8",
					DistanceKm:  1307,
					TimeOn:      timestamppb.New(time.Unix(1603656900, 0)),
					TimeOff:     timestamppb.New(time.Unix(1603656960, 0)),
					RstReceived: "-04",
					RstSent:     "-13",
					Qrzcom: &adifpb.Upload{
						UploadDate:   timestamppb.New(time.Unix(1603584000, 0)),
						UploadStatus: adifpb.UploadStatus_UPLOAD_COMPLETE,
					},
					Lotw: &adifpb.Qsl{
						SentDate:   timestamppb.New(time.Unix(1603584000, 0)),
						SentStatus: "Y",
					},
					AppDefined: map[string]string{
						"app_qrzlog_logid":   "557243669",
						"app_qrzlog_qsldate": "20201025",
						"app_qrzlog_status":  "C",
					},
				},
				backfill: &adifpb.Qso{
					LoggingStation:   &adifpb.Station{},
					ContactedStation: &adifpb.Station{StationCall: "N6DN"},
					Propagation:      &adifpb.Propagation{},
					Band:             "20m",
					Freq:             14.0761,
					Mode:             "FT8",
					TimeOn:           timestamppb.New(time.Unix(1603656900, 0)),
					Lotw: &adifpb.Qsl{
						ReceivedDate:   timestamppb.New(time.Unix(1604102400, 0)),
						ReceivedStatus: "Y",
					},
					AppDefined: map[string]string{
						"app_lotw_modegroup":     "DATA",
						"app_lotw_qso_timestamp": "2020-10-25T20:15:00Z",
						"app_lotw_rxqsl":         "2020-10-31 21:08:24",
						"app_lotw_rxqso":         "2020-10-25 20:29:33",
					},
				},
			},
			want: returnValues{
				diff: true,
				wantQso: &adifpb.Qso{
					LoggingStation: &adifpb.Station{
						OpName:      "Christopher C Keller",
						GridSquare:  "DM79LV",
						Latitude:    39.9103,
						Longitude:   -105.0569,
						Power:       50,
						StationCall: "K0SWE",
						City:        "Westminster",
						County:      "CO, Jefferson",
						State:       "CO",
						Country:     "United States",
						CqZone:      4,
						ItuZone:     7,
					},
					ContactedStation: &adifpb.Station{
						OpName:      "Paul M St John",
						GridSquare:  "CN94",
						Latitude:    33.8777,
						Longitude:   -117.7056,
						StationCall: "N6DN",
						City:        "Yorba Linda",
						County:      "CA, Orange",
						State:       "CA",
						Country:     "United States",
						Dxcc:        291,
						Continent:   "NA",
						Email:       "N6DN@ix.netcom.com",
					},
					Propagation: &adifpb.Propagation{},
					Band:        "20m",
					BandRx:      "20m",
					Freq:        14.0761,
					FreqRx:      14.0761,
					Mode:        "FT8",
					DistanceKm:  1307,
					TimeOn:      timestamppb.New(time.Unix(1603656900, 0)),
					TimeOff:     timestamppb.New(time.Unix(1603656960, 0)),
					RstReceived: "-04",
					RstSent:     "-13",
					Qrzcom: &adifpb.Upload{
						UploadDate:   timestamppb.New(time.Unix(1603584000, 0)),
						UploadStatus: adifpb.UploadStatus_UPLOAD_COMPLETE,
					},
					Lotw: &adifpb.Qsl{
						SentDate:       timestamppb.New(time.Unix(1603584000, 0)),
						SentStatus:     "Y",
						ReceivedDate:   timestamppb.New(time.Unix(1604102400, 0)),
						ReceivedStatus: "Y",
					},
					AppDefined: map[string]string{
						"app_qrzlog_logid":       "557243669",
						"app_qrzlog_qsldate":     "20201025",
						"app_qrzlog_status":      "C",
						"app_lotw_modegroup":     "DATA",
						"app_lotw_qso_timestamp": "2020-10-25T20:15:00Z",
						"app_lotw_rxqsl":         "2020-10-31 21:08:24",
						"app_lotw_rxqso":         "2020-10-25 20:29:33",
					},
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			diff := mergeQso(tt.args.base, tt.args.backfill)
			if diff != tt.want.diff {
				t.Errorf("mergeQso() diff got = %v, want %v", diff, tt.want.diff)
			}
			if !proto.Equal(tt.args.base, tt.want.wantQso) {
				t.Errorf("mergeQso() qso got = %v, want %v", tt.args.base, tt.want.wantQso)
			}
		})
	}
}
