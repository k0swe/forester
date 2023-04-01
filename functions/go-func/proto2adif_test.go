package forester

import (
	adifpb "github.com/k0swe/adif-json-protobuf/go"
	"google.golang.org/protobuf/types/known/timestamppb"
	"strings"
	"testing"
	"time"
)

func Test_proto2Adif(t *testing.T) {
	tests := []struct {
		name string
		arg  *adifpb.Adif
		want string
	}{
		{
			name: "empty",
			arg:  &adifpb.Adif{Qsos: []*adifpb.Qso{}},
			want: "",
		},
		{
			name: "single record",
			arg: &adifpb.Adif{Qsos: []*adifpb.Qso{
				{
					TimeOn: timestamppb.New(
						time.Date(2020, 03, 29, 00, 34, 00, 0, time.UTC)),
					Band:             "20m",
					Freq:             14.282,
					Mode:             "SSB",
					Submode:          "USB",
					ContactedStation: &adifpb.Station{StationCall: "KK9A"},
					LoggingStation:   &adifpb.Station{StationCall: "K0SWE"},
				},
			}},
			want: "<call:4>KK9A" + "<station_callsign:5>K0SWE" + "<band:3>20m" + "<freq:6>14.282" +
				"<mode:3>SSB" + "<qso_date:8>20200329" + "<time_on:6>003400" + "<submode:3>USB" +
				"<eor>",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := protoToAdif(tt.arg)
			if err != nil {
				t.Error(err)
			}
			if strings.TrimSpace(got) != tt.want {
				t.Errorf("protoToAdif() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_latLonToString(t *testing.T) {
	type args struct {
		latLon float64
		isLat  bool
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{name: "lat", args: args{latLon: 39.9142, isLat: true}, want: "N039 54.852"},
		{name: "lon", args: args{latLon: -105.0529, isLat: false}, want: "W105 03.174"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := latLonToString(tt.args.latLon, tt.args.isLat)
			if got != tt.want {
				t.Errorf("writeLatLon() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_dateTimeToString(t *testing.T) {
	tests := []struct {
		name     string
		arg      time.Time
		wantDate string
		wantTime string
	}{
		{
			name:     "KE0RCW",
			arg:      time.Date(2019, 05, 20, 23, 30, 03, 4, time.UTC),
			wantDate: "20190520",
			wantTime: "233003",
		},
		{
			name:     "K9IJ",
			arg:      time.Date(2020, 04, 03, 03, 38, 00, 5, time.UTC),
			wantDate: "20200403",
			wantTime: "033800",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotDate := dateToString(tt.arg)
			gotTime := timeToString(tt.arg)
			if gotDate != tt.wantDate {
				t.Errorf("writeDate() got = %v, want %v", gotDate, tt.wantDate)
			}
			if gotTime != tt.wantTime {
				t.Errorf("writeTime() got = %v, want %v", gotTime, tt.wantTime)
			}
		})
	}
}
