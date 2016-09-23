#! /usr/bin/perl

use strict;
use warnings;

my %lin;
my %sl;
open F,$ARGV[1] or die;
while(<F>){
  chomp;
  my ($sample,$lin,$sl) = split /\s+/,$_;
  $lin{$sample} = $lin;
  $sl{$sample} = $sl;
}
close F;

my %city;
$city{'lineage1'}{'lat'} = "51.5074";
$city{'lineage1'}{'lng'} = "0.1278";
$city{'lineage2'}{'lat'} = "52.4862";
$city{'lineage2'}{'lng'} = "-1.8904";
$city{'lineage3'}{'lat'} = "53.8008";
$city{'lineage3'}{'lng'} = "-1.5491";
$city{'lineage4'}{'lat'} = "53.4808";
$city{'lineage4'}{'lng'} = "-2.2426";
$city{'NA'}{'lat'} = "53.4808";
$city{'NA'}{'lng'} = "-2.2426";

open F, $ARGV[0] or die;
while(<F>){
  chomp;
  if ($_ =~ /id/){
    my $id;
    $_ =~ /(ERR\d+)/;
    $id = $1;
    if (!exists($city{$lin{$id}})){die $_;}
    my $lat = $city{$lin{$id}}{'lat'} + rand(0.1);
    my $lng = $city{$lin{$id}}{'lng'} - rand(0.1);
    $_ =~ s/\}/\,"coordinates\": [$lat,$lng]\}/;
    print "$_\n";
  } else {
    print "$_\n";
  }
}
