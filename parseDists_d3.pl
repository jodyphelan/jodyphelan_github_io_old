#!/usr/bin/perl

use strict;
use warnings;
use List::Util 'reduce';
sub minindex { my @x=@_; reduce { $x[$a] < $x[$b] ? $a : $b } 0..$#_ }

if (scalar @ARGV < 3){
	print "\nparseDists_viva.pl <dist_matrix> <minDist> <meta>\n\n";exit;
}

my %hasMeta;
my %meta;
my $ct = 0;
open F, $ARGV[2] or die;
while(<F>){
	my ($sample,$meta) = split /\s+/,$_;
	if (!exists($hasMeta{$meta})){
		$hasMeta{$meta} = $ct; $ct++;
	}
	$meta{$sample} = $hasMeta{$meta};
}
close F;

for (keys %meta) {
	print "$_\t$meta{$_}\n";
}

my %dists;
my @samples;
my $x=0;
my $i=0;
my $maxDist = $ARGV[1];
open F, $ARGV[0] or die;
while(<F>){
	chomp;
	$_ =~ s/\"//g;
	if ($x<1){
		$x++;
		@samples = split /\s+/,$_;
		next;
	}
	my ($sample,@dists) = split /\s+/,$_;
	$dists[$i]=10000;
	my $min = minindex @dists;
	$dists{$sample}{'neighbour'} = $samples[$min];
	$dists{$sample}{'dist'} = $dists[$min];
	print "$sample\t$samples[$min]\t$dists[$min]\n";
	$i++;
}
close(F);

my %samples;
my $count=0;
for(@samples){
	$samples{$_} = $count;
	$count++;
}

open OUT, ">d3/Data.json" or die;
my $nodeLine;
my $edgeLine;
my $numNodes = scalar %dists;
my $num = 0;
foreach my $sample (@samples) {
	if (!exists($meta{$sample})){$meta{$sample} = $ct;}
	if ($dists{$sample}{'dist'} <$maxDist){



		$nodeLine .= "\t\t{\"id\": \"$sample\",\"group\":$meta{$sample}},\n";

		$edgeLine .= "\t\t{\"source\": $samples{$sample}, \"target\": $samples{$dists{$sample}{'neighbour'}},\"value\":1},\n";
	} else {
		$nodeLine .= "\t\t{\"id\": \"$sample\",\"group\":$meta{$sample}},\n";

	}
	$num++;
}

print OUT "{\n\t\"graph\": [],\n\t\"nodes\":[\n";
print OUT substr($nodeLine,0,length($nodeLine)-2);
print OUT "],\n\t\"links\":[\n";
print OUT substr($edgeLine,0,length($edgeLine)-2);
print OUT "],\n\t\"directed\": false,\n\t\"multigraph\": false\n}";
